import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/services/api';
import { FolderKanban } from 'lucide-react';
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

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await userApi.getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">내 프로젝트</h1>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">참여 중인 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">진행률</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">태스크</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{project.taskCount}개</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">참여 인원</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{project.researchers.length}명</span>
                </div>

                {project.startDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">시작일</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(project.startDate).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
