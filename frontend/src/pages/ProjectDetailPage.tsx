import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi, userApi, publicApi } from '@/services/api';
import { ArrowLeft, Calendar, Users, TrendingUp, Trash2, UserPlus, X, Edit, Eye, EyeOff, History } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import KanbanBoard from '@/components/KanbanBoard';
import type { Project, Researcher, ProjectHistory } from '@/types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddResearcher, setShowAddResearcher] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [allResearchers, setAllResearchers] = useState<Researcher[]>([]);
  const [history, setHistory] = useState<ProjectHistory[]>([]);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    progress: 0,
    startDate: '',
    endDate: '',
    isPublic: true,
  });

  useEffect(() => {
    if (id) {
      loadProject(parseInt(id));
      loadResearchers();
    }
  }, [id]);

  const loadProject = async (projectId: number) => {
    try {
      const data = isAdmin ? await projectsApi.getById(projectId) : await userApi.getProjectById(projectId);
      setProject(data);
      loadHistory(projectId);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (projectId: number) => {
    try {
      const data = await userApi.getProjectHistory(projectId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load project history:', error);
    }
  };

  const loadResearchers = async () => {
    try {
      const data = await publicApi.getResearchers();
      setAllResearchers(data);
    } catch (error) {
      console.error('Failed to load researchers:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      await projectsApi.delete(project.id);
      alert('프로젝트가 삭제되었습니다.');
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleAddResearcher = async (researcherId: number) => {
    if (!project) return;
    try {
      const researcherIds = [...project.researchers.map(r => r.id), researcherId];
      // All users use user API (with history tracking)
      // Send all required fields to satisfy backend validation
      await userApi.updateProject(project.id, {
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate,
        isPublic: project.isPublic,
        researcherIds
      });
      await loadProject(project.id);
      setShowAddResearcher(false);
    } catch (error) {
      console.error('Failed to add researcher:', error);
      alert('연구원 추가에 실패했습니다.');
    }
  };

  const handleRemoveResearcher = async (researcherId: number) => {
    if (!project) return;
    if (!confirm('이 연구원을 프로젝트에서 제외하시겠습니까?')) return;
    try {
      const researcherIds = project.researchers.filter(r => r.id !== researcherId).map(r => r.id);
      // All users use user API (with history tracking)
      // Send all required fields to satisfy backend validation
      await userApi.updateProject(project.id, {
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate,
        isPublic: project.isPublic,
        researcherIds
      });
      await loadProject(project.id);
    } catch (error) {
      console.error('Failed to remove researcher:', error);
      alert('연구원 제거에 실패했습니다.');
    }
  };

  const handleEditClick = () => {
    if (!project) return;
    setEditForm({
      name: project.name,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      startDate: project.startDate,
      endDate: project.endDate || '',
      isPublic: project.isPublic ?? true,
    });
    setShowEditProject(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      // All users use user API (with history tracking)
      await userApi.updateProject(project.id, editForm);
      alert('프로젝트가 수정되었습니다.');
      await loadProject(project.id);
      setShowEditProject(false);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('프로젝트 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Edit className="w-5 h-5" />
            편집
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
              삭제
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">진행률</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.progress}%</div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">참여 인원</span>
            </div>
            <button
              onClick={() => setShowAddResearcher(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.researchers.length}명</div>
          <div className="mt-2 space-y-1">
            {project.researchers.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{r.name}</span>
                <button
                  onClick={() => handleRemoveResearcher(r.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">기간</span>
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-100">
            {new Date(project.startDate).toLocaleDateString('ko-KR')}
            {project.endDate && (
              <> ~ {new Date(project.endDate).toLocaleDateString('ko-KR')}</>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">칸반 보드</h2>
        <KanbanBoard projectId={project.id} />
      </div>

      {/* Project History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">프로젝트 히스토리</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">(최근 15개)</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            아직 히스토리가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {entry.researcherName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {entry.researcherName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.researcherEmail}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {entry.description}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {entry.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">프로젝트 삭제</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Researcher Modal */}
      {showAddResearcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">연구원 추가</h2>
              <button onClick={() => setShowAddResearcher(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allResearchers
                .filter(r => !project.researchers.find(pr => pr.id === r.id))
                .map(researcher => (
                  <button
                    key={researcher.id}
                    onClick={() => handleAddResearcher(researcher.id)}
                    className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">{researcher.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{researcher.email}</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">프로젝트 편집</h2>
              <button onClick={() => setShowEditProject(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  프로젝트명 *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  설명
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    상태
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="PLANNING">계획</option>
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="COMPLETED">완료</option>
                    <option value="ON_HOLD">보류</option>
                    <option value="CANCELLED">취소</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    우선순위
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="HIGH">높음</option>
                    <option value="MEDIUM">보통</option>
                    <option value="LOW">낮음</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  진행률: {editForm.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editForm.progress}
                  onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    시작일 *
                  </label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {editForm.isPublic ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {editForm.isPublic ? '외부 공개' : '내부 전용'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {editForm.isPublic ? '랩 외부에서 볼 수 있습니다' : '랩 구성원만 볼 수 있습니다'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isPublic: !editForm.isPublic })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editForm.isPublic ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editForm.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProject(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
