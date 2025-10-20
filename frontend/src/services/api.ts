import axios from 'axios';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Researcher,
  Project,
  Task,
  DashboardStats,
  Seminar,
  Announcement,
  Comment,
  ProjectHistory,
  Notice,
  Board,
  BoardComment,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout and redirect to login on 401 Unauthorized
    // Don't logout on 403 Forbidden (access denied but still authenticated)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/auth/login', data);
    return response.data.data;
  },
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data.data;
  },
};

// Researchers API
export const researchersApi = {
  getAll: async (): Promise<Researcher[]> => {
    const response = await api.get<ApiResponse<Researcher[]>>('/admin/researchers');
    return response.data.data;
  },
  getById: async (id: number): Promise<Researcher> => {
    const response = await api.get<ApiResponse<Researcher>>(`/admin/researchers/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Researcher>): Promise<Researcher> => {
    const response = await api.post<ApiResponse<Researcher>>('/admin/researchers', data);
    return response.data.data;
  },
  update: async (id: number, data: Partial<Researcher>): Promise<Researcher> => {
    const response = await api.put<ApiResponse<Researcher>>(`/admin/researchers/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/researchers/${id}`);
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/admin/projects');
    return response.data.data;
  },
  getById: async (id: number): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/admin/projects/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Project>): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/admin/projects', data);
    return response.data.data;
  },
  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(`/admin/projects/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/projects/${id}`);
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (params?: { projectId?: number; researcherId?: number }): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/admin/tasks', { params });
    return response.data.data;
  },
  getById: async (id: number): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/admin/tasks/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Task>): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/admin/tasks', data);
    return response.data.data;
  },
  update: async (id: number, data: Partial<Task>): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/admin/tasks/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/tasks/${id}`);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },
};

// User API
export const userApi = {
  getMyProfile: async (): Promise<Researcher> => {
    const response = await api.get<ApiResponse<Researcher>>('/user/my-profile');
    return response.data.data;
  },
  updateMyProfile: async (data: Partial<Researcher>): Promise<Researcher> => {
    const response = await api.put<ApiResponse<Researcher>>('/user/my-profile', data);
    return response.data.data;
  },
  getMyTasks: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/user/my-tasks');
    return response.data.data;
  },
  getMyProjects: async (): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/user/my-projects');
    return response.data.data;
  },
  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/user/projects');
    return response.data.data;
  },
  getProjectById: async (id: number): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/user/projects/${id}`);
    return response.data.data;
  },
  requestJoinTask: async (taskId: number): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(`/user/tasks/${taskId}/request-join`);
    return response.data.data;
  },
  updateMyTask: async (taskId: number, data: Partial<Task>): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/user/tasks/${taskId}`, data);
    return response.data.data;
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/user/projects', data);
    return response.data.data;
  },
  getProjectTasks: async (projectId: number): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>(`/user/projects/${projectId}/tasks`);
    return response.data.data;
  },
  createResearchArea: async (name: string, description?: string): Promise<{ id: number; name: string; description: string | null }> => {
    const response = await api.post<ApiResponse<{ id: number; name: string; description: string | null }>>('/user/research-areas', { name, description });
    return response.data.data;
  },
  updateProject: async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(`/user/projects/${id}`, data);
    return response.data.data;
  },
  createTask: async (projectId: number, data: Partial<Task>): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(`/user/projects/${projectId}/tasks`, data);
    return response.data.data;
  },
  updateTask: async (projectId: number, taskId: number, data: Partial<Task>): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/user/projects/${projectId}/tasks/${taskId}`, data);
    return response.data.data;
  },
  getProjectHistory: async (projectId: number): Promise<ProjectHistory[]> => {
    const response = await api.get<ApiResponse<ProjectHistory[]>>(`/user/projects/${projectId}/history`);
    return response.data.data;
  },
  deleteTask: async (projectId: number, taskId: number): Promise<void> => {
    await api.delete(`/user/projects/${projectId}/tasks/${taskId}`);
  },
  // User Notices API (view only, for researchers)
  getNotices: async (page = 0, size = 10): Promise<{ content: Notice[]; totalPages: number; totalElements: number }> => {
    const response = await api.get('/user/notices', { params: { page, size } });
    return response.data;
  },
  getNoticeById: async (id: number): Promise<Notice> => {
    const response = await api.get(`/user/notices/${id}`);
    return response.data;
  },
  // Account Management
  updateMyUsername: async (newUsername: string): Promise<void> => {
    await api.put('/user/account/username', { newUsername });
  },
  changeMyPassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/user/account/password', { currentPassword, newPassword });
  },
};

// Public API (no auth required)
export const publicApi = {
  getLabInfo: async () => {
    const response = await axios.get('/api/public/lab/info');
    return response.data.data;
  },
  getResearchers: async () => {
    const response = await axios.get('/api/public/researchers');
    return response.data.data;
  },
  getProjects: async () => {
    const response = await axios.get('/api/public/projects');
    return response.data.data;
  },
  getResearchAreas: async () => {
    const response = await axios.get('/api/public/research-areas');
    return response.data.data;
  },
  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axios.get('/api/public/announcements');
    return response.data.data;
  },
  getImportantAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axios.get('/api/public/announcements/important');
    return response.data.data;
  },
  // Notices API
  getNotices: async (limit?: number): Promise<Notice[]> => {
    const response = await axios.get('/api/public/notices/latest', {
      params: { limit: limit || 5 }
    });
    return response.data.data;
  },
  getNoticeById: async (id: number): Promise<Notice> => {
    const response = await axios.get(`/api/public/notices/${id}`);
    return response.data.data;
  },
};

// Admin Users API
export const adminUsersApi = {
  getAll: async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  },
  toggleStatus: async (id: number) => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data.data;
  },
  delete: async (id: number) => {
    await api.delete(`/admin/users/${id}`);
  },
};

// File Upload API
export const fileUploadApi = {
  uploadProfilePhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/upload/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<string>>('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  uploadFile: async (file: File): Promise<{ fileUrl: string; originalName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<{ fileUrl: string; originalName: string }>>('/admin/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

// Seminars API
export const seminarsApi = {
  getAll: async (): Promise<Seminar[]> => {
    const response = await api.get<ApiResponse<Seminar[]>>('/admin/seminars');
    return response.data.data;
  },
  getById: async (id: number): Promise<Seminar> => {
    const response = await api.get<ApiResponse<Seminar>>(`/admin/seminars/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Seminar>): Promise<Seminar> => {
    const response = await api.post<ApiResponse<Seminar>>('/admin/seminars', data);
    return response.data.data;
  },
  update: async (id: number, data: Partial<Seminar>): Promise<Seminar> => {
    const response = await api.put<ApiResponse<Seminar>>(`/admin/seminars/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/seminars/${id}`);
  },
  getByDateRange: async (startDate: string, endDate: string): Promise<Seminar[]> => {
    const response = await api.get<ApiResponse<Seminar[]>>('/admin/seminars/by-date-range', {
      params: { startDate, endDate },
    });
    return response.data.data;
  },
};

// User Account Management API
export const userAccountApi = {
  createAccount: async (researcherId: number, data: { username: string; password: string }): Promise<void> => {
    await api.post(`/admin/researchers/${researcherId}/account`, data);
  },
  updateUsername: async (researcherId: number, username: string): Promise<void> => {
    await api.put(`/admin/researchers/${researcherId}/account/username`, { username });
  },
  changePassword: async (researcherId: number, newPassword: string): Promise<void> => {
    await api.put(`/admin/researchers/${researcherId}/account/password`, { newPassword });
  },
  deleteAccount: async (researcherId: number): Promise<void> => {
    await api.delete(`/admin/researchers/${researcherId}/account`);
  },
};

// Announcements API (Admin)
export const announcementsApi = {
  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get<ApiResponse<Announcement[]>>('/admin/announcements');
    return response.data.data;
  },
  getById: async (id: number): Promise<Announcement> => {
    const response = await api.get<ApiResponse<Announcement>>(`/admin/announcements/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Announcement>): Promise<Announcement> => {
    const response = await api.post<ApiResponse<Announcement>>('/admin/announcements', data);
    return response.data.data;
  },
  update: async (id: number, data: Partial<Announcement>): Promise<Announcement> => {
    const response = await api.put<ApiResponse<Announcement>>(`/admin/announcements/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/announcements/${id}`);
  },
};

// Comments API (User)
export const commentsApi = {
  getTaskComments: async (taskId: number): Promise<Comment[]> => {
    const response = await api.get<ApiResponse<Comment[]>>(`/user/tasks/${taskId}/comments`);
    return response.data.data;
  },
  createComment: async (taskId: number, content: string): Promise<Comment> => {
    const response = await api.post<ApiResponse<Comment>>(`/user/tasks/${taskId}/comments`, { content });
    return response.data.data;
  },
  updateComment: async (commentId: number, content: string): Promise<Comment> => {
    const response = await api.put<ApiResponse<Comment>>(`/user/comments/${commentId}`, { content });
    return response.data.data;
  },
  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/user/comments/${commentId}`);
  },
};

// Notices API (Admin)
export const noticesApi = {
  getAll: async (page = 0, size = 10): Promise<{ content: Notice[]; totalPages: number; totalElements: number }> => {
    const response = await api.get('/admin/notices', { params: { page, size } });
    return response.data;
  },
  getById: async (id: number): Promise<Notice> => {
    const response = await api.get<ApiResponse<Notice>>(`/admin/notices/${id}`);
    return response.data.data;
  },
  create: async (data: { title: string; content: string; isPublic: boolean; imageUrl?: string; attachmentUrl?: string; attachmentName?: string }): Promise<Notice> => {
    const response = await api.post<ApiResponse<Notice>>('/admin/notices', data);
    return response.data.data;
  },
  update: async (id: number, data: { title: string; content: string; isPublic: boolean; imageUrl?: string; attachmentUrl?: string; attachmentName?: string }): Promise<Notice> => {
    const response = await api.put<ApiResponse<Notice>>(`/admin/notices/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/notices/${id}`);
  },
};

// Boards API (Admin/User)
export const boardsApi = {
  // Admin APIs
  getAll: async (page = 0, size = 10): Promise<{ content: Board[]; totalPages: number; totalElements: number }> => {
    const response = await api.get('/admin/boards', { params: { page, size } });
    return response.data;
  },
  getById: async (id: number): Promise<Board> => {
    const response = await api.get(`/admin/boards/${id}`);
    return response.data;
  },
  create: async (data: { title: string; content: string; isPublic: boolean; imageUrl?: string }): Promise<Board> => {
    const response = await api.post<ApiResponse<Board>>('/admin/boards', data);
    return response.data.data;
  },
  update: async (id: number, data: { title: string; content: string; isPublic: boolean; imageUrl?: string }): Promise<Board> => {
    const response = await api.put<ApiResponse<Board>>(`/admin/boards/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/boards/${id}`);
  },
  search: async (keyword: string, page = 0, size = 10): Promise<{ content: Board[]; totalPages: number; totalElements: number }> => {
    const response = await api.get('/admin/boards/search', { params: { keyword, page, size } });
    return response.data;
  },
  // Comments APIs
  getComments: async (boardId: number): Promise<BoardComment[]> => {
    const response = await api.get(`/admin/boards/${boardId}/comments`);
    return response.data;
  },
  createComment: async (boardId: number, content: string): Promise<BoardComment> => {
    const response = await api.post<ApiResponse<BoardComment>>(`/admin/boards/${boardId}/comments`, { content });
    return response.data.data;
  },
  updateComment: async (commentId: number, content: string): Promise<BoardComment> => {
    const response = await api.put<ApiResponse<BoardComment>>(`/admin/boards/comments/${commentId}`, { content });
    return response.data.data;
  },
  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/admin/boards/comments/${commentId}`);
  },
};

// Helper function to parse attachments JSON string
const parseBoardAttachments = (board: any): Board => {
  console.log('Parsing board attachments:', board.attachments, typeof board.attachments);

  if (board.attachments) {
    if (typeof board.attachments === 'string') {
      try {
        board.attachments = JSON.parse(board.attachments);
        console.log('Parsed attachments:', board.attachments);
      } catch (e) {
        console.error('Failed to parse attachments:', e, board.attachments);
        board.attachments = [];
      }
    }
  } else {
    // attachments가 없으면 빈 배열로 초기화
    board.attachments = [];
  }

  return board;
};

// User Boards API
export const userBoardsApi = {
  getAll: async (page = 0, size = 10): Promise<{ content: Board[]; totalPages: number; totalElements: number }> => {
    const response = await api.get('/user/boards', { params: { page, size } });
    const data = response.data;
    if (data.content) {
      data.content = data.content.map(parseBoardAttachments);
    }
    return data;
  },
  getById: async (id: number): Promise<Board> => {
    const response = await api.get(`/user/boards/${id}`);
    return parseBoardAttachments(response.data);
  },
  create: async (data: { title: string; content: string; isPublic: boolean; imageUrl?: string; attachmentName?: string; attachments?: string }): Promise<Board> => {
    const response = await api.post<ApiResponse<Board>>('/user/boards', data);
    return parseBoardAttachments(response.data.data);
  },
  update: async (id: number, data: { title: string; content: string; isPublic: boolean; imageUrl?: string; attachmentName?: string; attachments?: string }): Promise<Board> => {
    const response = await api.put<ApiResponse<Board>>(`/user/boards/${id}`, data);
    return parseBoardAttachments(response.data.data);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/user/boards/${id}`);
  },
  search: async (keyword: string, page = 0, size = 10): Promise<{ content: Board[]; totalPages: number; totalElements: number }> => {
    const response = await api.get('/user/boards/search', { params: { keyword, page, size } });
    const data = response.data;
    if (data.content) {
      data.content = data.content.map(parseBoardAttachments);
    }
    return data;
  },
  getComments: async (boardId: number): Promise<BoardComment[]> => {
    const response = await api.get(`/user/boards/${boardId}/comments`);
    return response.data;
  },
  createComment: async (boardId: number, content: string): Promise<BoardComment> => {
    const response = await api.post<ApiResponse<BoardComment>>(`/user/boards/${boardId}/comments`, { content });
    return response.data.data;
  },
  updateComment: async (commentId: number, content: string): Promise<BoardComment> => {
    const response = await api.put<ApiResponse<BoardComment>>(`/user/boards/comments/${commentId}`, { content });
    return response.data.data;
  },
  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/user/boards/comments/${commentId}`);
  },
};

export default api;
