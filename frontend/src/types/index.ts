export interface Researcher {
  id: number;
  name: string;
  studentId: string;
  grade: 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR' | 'GRADUATE';
  admissionYear: number;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'GRADUATED' | 'INTERNSHIP';
  joinDate: string;
  researchAreas: string[];
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  username?: string;
  hasAccount: boolean;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  progress: number;
  startDate: string;
  endDate?: string;
  budget?: number;
  isPublic: boolean;
  categories: string[];
  researchers: Researcher[];
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: string;
  estimatedHours?: number;
  projectId: number;
  projectName: string;
  assignees: Researcher[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalResearchers: number;
  activeResearchers: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  projectsByStatus: Record<string, number>;
  tasksByStatus: Record<string, number>;
}

export interface User {
  token: string;
  username: string;
  role: string;
  researcherId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  researcherId?: number;
}

export interface Seminar {
  id: number;
  title: string;
  content?: string;
  presenter?: Researcher;
  seminarDate: string;
  location?: string;
  topic?: string;
  isPublic: boolean;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  isImportant: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  authorName: string;
  authorEmail: string;
  authorPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectHistory {
  id: number;
  projectId: number;
  researcherName: string;
  researcherEmail: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  isPublic: boolean;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: number;
  title: string;
  content: string;
  isPublic: boolean;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  authorId: number;
  authorName: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardComment {
  id: number;
  content: string;
  boardId: number;
  authorId: number;
  authorName: string;
  authorPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
