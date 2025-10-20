import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { projectsApi, userApi } from '@/services/api';
import { Plus, FolderKanban, X, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { Project } from '@/types';

const statusColors = {
  PLANNING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  PLANNING: '계획',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  ON_HOLD: '보류',
  CANCELLED: '취소',
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadProjects = async () => {
    try {
      const data = isAdmin ? await projectsApi.getAll() : await userApi.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateProject = async (data: any) => {
    try {
      const projectData = { ...data, isPublic };
      await (isAdmin ? projectsApi.create(projectData) : userApi.createProject(projectData));
      await loadProjects();
      setShowCreateModal(false);
      setIsPublic(true);
      reset();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: number, projectName: string) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!confirm(`"${projectName}" 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

    try {
      await projectsApi.delete(projectId);
      alert('프로젝트가 삭제되었습니다.');
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">프로젝트</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          새 프로젝트
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FolderKanban className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </span>
                {project.isPublic ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    외부공개
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    내부전용
                  </span>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                  title="프로젝트 삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">진행률</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">태스크</span>
                <span className="font-semibold text-gray-900">{project.taskCount}개</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">참여 인원</span>
                <span className="font-semibold text-gray-900">{project.researchers.length}명</span>
              </div>

              {project.startDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">시작일</span>
                  <span className="text-gray-900">
                    {new Date(project.startDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">새 프로젝트</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onCreateProject)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  프로젝트명 *
                </label>
                <input
                  {...register('name', { required: '프로젝트명을 입력하세요' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{String(errors.name.message)}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  설명
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  시작일 *
                </label>
                <input
                  type="date"
                  {...register('startDate', { required: '시작일을 입력하세요' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                {errors.startDate && <p className="text-red-600 text-sm mt-1">{String(errors.startDate.message)}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  상태
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="PLANNING">계획</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="COMPLETED">완료</option>
                  <option value="ON_HOLD">보류</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  우선순위
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="HIGH">높음</option>
                  <option value="MEDIUM">보통</option>
                  <option value="LOW">낮음</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {isPublic ? '외부 공개' : '내부 전용'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isPublic ? '랩 외부에서 볼 수 있습니다' : '랩 구성원만 볼 수 있습니다'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPublic ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
