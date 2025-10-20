package com.lab.management.service;

import com.lab.management.dto.mapper.TaskMapper;
import com.lab.management.dto.request.TaskRequest;
import com.lab.management.dto.response.TaskResponse;
import com.lab.management.entity.Project;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.Task;
import com.lab.management.entity.TaskStatus;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.ProjectRepository;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ResearcherRepository researcherRepository;
    private final TaskMapper taskMapper;
    private final ProjectHistoryService projectHistoryService;

    public List<TaskResponse> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return taskMapper.toResponseList(tasks);
    }

    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        List<Task> tasks = taskRepository.findByStatus(status);
        return taskMapper.toResponseList(tasks);
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return taskMapper.toResponse(task);
    }

    public List<TaskResponse> getTasksByProjectId(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return taskMapper.toResponseList(tasks);
    }

    public List<TaskResponse> getTasksByResearcherId(Long researcherId) {
        List<Task> tasks = taskRepository.findByResearcherId(researcherId);
        return taskMapper.toResponseList(tasks);
    }

    public List<TaskResponse> getOverdueTasks() {
        List<Task> tasks = taskRepository.findOverdueTasks(LocalDate.now());
        return taskMapper.toResponseList(tasks);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Task task = taskMapper.toEntity(request);

        // Set project (required)
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));
        task.setProject(project);

        // Set default status if not provided
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TODO);
        }

        // Associate assignees if provided
        if (request.getAssigneeIds() != null && !request.getAssigneeIds().isEmpty()) {
            List<Researcher> assignees = researcherRepository.findAllById(request.getAssigneeIds());
            task.setAssignees(assignees);
        }

        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskMapper.updateEntityFromRequest(request, task);

        // Update project if changed
        if (request.getProjectId() != null && !task.getProject().getId().equals(request.getProjectId())) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));
            task.setProject(project);
        }

        // Update assignees if provided
        if (request.getAssigneeIds() != null) {
            List<Researcher> assignees = researcherRepository.findAllById(request.getAssigneeIds());
            task.setAssignees(assignees);
        }

        Task updatedTask = taskRepository.save(task);
        return taskMapper.toResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
    }

    public long countByStatus(TaskStatus status) {
        return taskRepository.countByStatus(status);
    }

    @Transactional
    public TaskResponse requestJoinTask(Long taskId, Long researcherId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        Researcher researcher = researcherRepository.findById(researcherId)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher", "id", researcherId));

        // Check if already assigned
        if (task.getAssignees().contains(researcher)) {
            throw new IllegalStateException("Researcher is already assigned to this task");
        }

        // Add researcher to assignees
        task.getAssignees().add(researcher);
        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }

    @Transactional
    public TaskResponse createTaskWithHistory(TaskRequest request, Researcher researcher) {
        TaskResponse taskResponse = createTask(request);

        // Get the created task and project
        Task task = taskRepository.findById(taskResponse.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskResponse.getId()));
        Project project = task.getProject();

        // Log history
        projectHistoryService.logHistory(project, researcher, "TASK_CREATED",
                String.format("태스크 '%s' 생성", task.getName()));

        return taskResponse;
    }

    @Transactional
    public TaskResponse updateTaskWithHistory(Long id, TaskRequest request, Researcher researcher) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = task.getProject();

        // Track changes
        StringBuilder changes = new StringBuilder();
        if (request.getName() != null && !task.getName().equals(request.getName())) {
            changes.append(String.format("태스크명 변경: %s → %s; ", task.getName(), request.getName()));
        }
        if (request.getStatus() != null && !task.getStatus().equals(request.getStatus())) {
            changes.append(String.format("상태 변경: %s → %s; ", task.getStatus(), request.getStatus()));
        }

        TaskResponse taskResponse = updateTask(id, request);

        // Log history
        if (changes.length() > 0) {
            projectHistoryService.logHistory(project, researcher, "TASK_UPDATED",
                    String.format("태스크 '%s' 수정: %s", task.getName(), changes.toString()));
        }

        return taskResponse;
    }

    @Transactional
    public void deleteTaskWithHistory(Long id, Researcher researcher) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = task.getProject();
        String taskName = task.getName();

        // Delete the task
        taskRepository.delete(task);

        // Log history
        projectHistoryService.logHistory(project, researcher, "TASK_DELETED",
                String.format("태스크 '%s' 삭제", taskName));
    }
}
