import { useState, useEffect } from 'react';
import { researchersApi, userAccountApi, publicApi } from '@/services/api';
import { User, Mail, Phone, Calendar, Plus, Edit2, Trash2, X, Key, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { Researcher } from '@/types';

const gradeLabels = {
  FRESHMAN: '1학년',
  SOPHOMORE: '2학년',
  JUNIOR: '3학년',
  SENIOR: '4학년',
  GRADUATE: '대학원',
};

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  ON_LEAVE: 'bg-yellow-100 text-yellow-800',
  GRADUATED: 'bg-gray-100 text-gray-800',
  INTERNSHIP: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  ACTIVE: '활성',
  ON_LEAVE: '휴학',
  GRADUATED: '졸업',
  INTERNSHIP: '인턴',
};

export default function ResearchersPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    grade: 'SOPHOMORE' as Researcher['grade'],
    admissionYear: new Date().getFullYear(),
    email: '',
    phone: '',
    status: 'ACTIVE' as Researcher['status'],
    joinDate: new Date().toISOString().split('T')[0],
    researchAreas: [] as string[],
    photoUrl: '',
  });
  const [accountData, setAccountData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    loadResearchers();
  }, []);

  const loadResearchers = async () => {
    try {
      const data = isAdmin ? await researchersApi.getAll() : await publicApi.getResearchers();
      setResearchers(data);
    } catch (error) {
      console.error('Failed to load researchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedResearcher(null);
    setFormData({
      name: '',
      studentId: '',
      grade: 'SOPHOMORE',
      admissionYear: new Date().getFullYear(),
      email: '',
      phone: '',
      status: 'ACTIVE',
      joinDate: new Date().toISOString().split('T')[0],
      researchAreas: [],
      photoUrl: '',
    });
    setShowModal(true);
  };

  const handleEdit = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setFormData({
      name: researcher.name,
      studentId: researcher.studentId,
      grade: researcher.grade,
      admissionYear: researcher.admissionYear,
      email: researcher.email,
      phone: researcher.phone || '',
      status: researcher.status,
      joinDate: researcher.joinDate,
      researchAreas: researcher.researchAreas,
      photoUrl: researcher.photoUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedResearcher) return;
    try {
      await researchersApi.delete(selectedResearcher.id);
      await loadResearchers();
      setShowDeleteConfirm(false);
      setSelectedResearcher(null);
      alert('연구원이 삭제되었습니다.');
    } catch (error) {
      alert('연구원 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedResearcher) {
        await researchersApi.update(selectedResearcher.id, formData);
        alert('연구원 정보가 수정되었습니다.');
      } else {
        await researchersApi.create(formData);
        alert('새 연구원이 추가되었습니다.');
      }
      await loadResearchers();
      setShowModal(false);
    } catch (error) {
      alert('작업에 실패했습니다.');
    }
  };

  const toggleResearchArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.includes(area)
        ? prev.researchAreas.filter(a => a !== area)
        : [...prev.researchAreas, area]
    }));
  };

  const handleManageAccount = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setAccountData({
      username: researcher.username || '',
      password: '',
    });
    setShowAccountModal(true);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResearcher) return;

    try {
      if (selectedResearcher.hasAccount) {
        // Update existing account
        if (accountData.username !== selectedResearcher.username) {
          await userAccountApi.updateUsername(selectedResearcher.id, accountData.username);
        }
        if (accountData.password) {
          await userAccountApi.changePassword(selectedResearcher.id, accountData.password);
        }
        alert('계정 정보가 수정되었습니다.');
      } else {
        // Create new account
        await userAccountApi.createAccount(selectedResearcher.id, accountData);
        alert('계정이 생성되었습니다.');
      }
      await loadResearchers();
      setShowAccountModal(false);
    } catch (error) {
      alert('작업에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedResearcher) return;
    try {
      await userAccountApi.deleteAccount(selectedResearcher.id);
      await loadResearchers();
      setShowAccountModal(false);
      alert('계정이 삭제되었습니다.');
    } catch (error) {
      alert('계정 삭제에 실패했습니다.');
    }
  };

  const researchAreaOptions = [
    'Medical_AI', 'Deep_Learning', 'CT_Physics', 'Computer_Vision', 'LLM', 'Backend', 'Data_Analysis'
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">연구원</h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            연구원 추가
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchers.map((researcher) => (
          <div
            key={researcher.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{researcher.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{researcher.studentId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[researcher.status]}`}>
                  {statusLabels[researcher.status]}
                </span>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(researcher)}
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(researcher)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {gradeLabels[researcher.grade]} ({researcher.admissionYear}학번)
              </div>

              {researcher.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {researcher.email}
                </div>
              )}

              {researcher.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {researcher.phone}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">연구 분야</p>
              <div className="flex flex-wrap gap-2">
                {researcher.researchAreas.map((area) => (
                  <span
                    key={area}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs"
                  >
                    {area.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Account Information Section */}
            {isAdmin && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {researcher.hasAccount ? (
                      <>
                        <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          계정: <span className="font-medium text-gray-900 dark:text-gray-100">{researcher.username}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-500">계정 없음</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleManageAccount(researcher)}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded"
                    title={researcher.hasAccount ? '계정 관리' : '계정 생성'}
                  >
                    <Key className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedResearcher ? '연구원 수정' : '새 연구원 추가'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    학번 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    학년 *
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as Researcher['grade'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="FRESHMAN">1학년</option>
                    <option value="SOPHOMORE">2학년</option>
                    <option value="JUNIOR">3학년</option>
                    <option value="SENIOR">4학년</option>
                    <option value="GRADUATE">대학원</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    입학년도 *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.admissionYear}
                    onChange={(e) => setFormData({ ...formData, admissionYear: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    상태 *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Researcher['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="ACTIVE">활성</option>
                    <option value="ON_LEAVE">휴학</option>
                    <option value="GRADUATED">졸업</option>
                    <option value="INTERNSHIP">인턴</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  연구 분야 *
                </label>
                <div className="flex flex-wrap gap-2">
                  {researchAreaOptions.map(area => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleResearchArea(area)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        formData.researchAreas.includes(area)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {area.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  사진 URL
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {selectedResearcher ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedResearcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">연구원 삭제</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              정말로 <strong>{selectedResearcher.name}</strong> 연구원을 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedResearcher(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Management Modal */}
      {showAccountModal && selectedResearcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {selectedResearcher.hasAccount ? '계정 관리' : '계정 생성'}
              </h2>
              <button
                onClick={() => setShowAccountModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong>{selectedResearcher.name}</strong>님의 로그인 계정을 관리합니다.
            </p>

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  사용자 이름 *
                </label>
                <input
                  type="text"
                  required
                  value={accountData.username}
                  onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="사용자 이름 입력"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  비밀번호 {selectedResearcher.hasAccount && '(변경시에만 입력)'}
                </label>
                <input
                  type="password"
                  required={!selectedResearcher.hasAccount}
                  value={accountData.password}
                  onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder={selectedResearcher.hasAccount ? '변경하려면 입력' : '비밀번호 입력'}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {selectedResearcher.hasAccount && (
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    계정 삭제
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {selectedResearcher.hasAccount ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
