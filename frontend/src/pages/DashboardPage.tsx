import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, projectsApi } from '@/services/api';
import { BarChart3, Users, FolderKanban, CheckSquare, TrendingUp } from 'lucide-react';
import type { DashboardStats, Project } from '@/types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, projectsData] = await Promise.all([
        dashboardApi.getStats(),
        projectsApi.getAll(),
      ]);
      setStats(statsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: '전체 연구원',
      value: stats.totalResearchers,
      icon: Users,
      color: 'bg-blue-500',
      subtext: `활성: ${stats.activeResearchers}`,
    },
    {
      title: '전체 프로젝트',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'bg-green-500',
      subtext: `진행 중: ${stats.activeProjects}`,
    },
    {
      title: '전체 태스크',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-purple-500',
      subtext: `완료: ${stats.completedTasks}`,
    },
    {
      title: '완료율',
      value: `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      subtext: `${stats.completedTasks}/${stats.totalTasks}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-sm text-gray-500">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">진행 중인 프로젝트</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            전체 보기 →
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {projects.filter(p => p.status === 'IN_PROGRESS').slice(0, 5).map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                </div>
                <div className="ml-4 flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                    <div className="text-xs text-gray-500">진행률</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
