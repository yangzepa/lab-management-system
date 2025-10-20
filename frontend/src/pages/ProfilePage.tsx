import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Camera, Save, Loader2, User as UserIcon, Mail, Phone, Award, Plus, X, Lock, Key } from 'lucide-react';
import { userApi, fileUploadApi, publicApi } from '@/services/api';
import type { Researcher } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Researcher | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [availableResearchAreas, setAvailableResearchAreas] = useState<string[]>([]);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDescription, setNewAreaDescription] = useState('');
  const [addingArea, setAddingArea] = useState(false);

  // Account settings state
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Researcher>>();

  useEffect(() => {
    loadProfile();
    loadResearchAreas();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getMyProfile();
      setProfile(data);
      setPhotoUrl(data.photoUrl || null);
      setSelectedAreas(data.researchAreas || []);
      reset(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResearchAreas = async () => {
    try {
      const areas = await publicApi.getResearchAreas();
      setAvailableResearchAreas(areas);
    } catch (error) {
      console.error('Failed to load research areas:', error);
    }
  };

  const onSubmit = async (data: Partial<Researcher>) => {
    try {
      setSaving(true);
      const updated = await userApi.updateMyProfile({
        ...data,
        photoUrl: photoUrl || undefined,
        researchAreas: selectedAreas,
      });
      setProfile(updated);
      alert('프로필이 성공적으로 업데이트되었습니다!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const toggleResearchArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      setUploading(true);
      const response = await fileUploadApi.uploadProfilePhoto(file);
      setPhotoUrl(response.url);
      alert('프로필 사진이 업로드되었습니다!');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('사진 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddResearchArea = async () => {
    if (!newAreaName.trim()) {
      alert('연구분야 이름을 입력하세요.');
      return;
    }

    try {
      setAddingArea(true);
      await userApi.createResearchArea(newAreaName.trim(), newAreaDescription.trim() || undefined);
      await loadResearchAreas();
      setShowAddAreaModal(false);
      setNewAreaName('');
      setNewAreaDescription('');
      alert('새로운 연구분야가 추가되었습니다!');
    } catch (error: any) {
      console.error('Failed to add research area:', error);
      alert(error.response?.data?.message || '연구분야 추가에 실패했습니다.');
    } finally {
      setAddingArea(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      alert('새 사용자명을 입력하세요.');
      return;
    }

    if (newUsername.trim().length < 3) {
      alert('사용자명은 최소 3자 이상이어야 합니다.');
      return;
    }

    try {
      setUpdatingUsername(true);
      await userApi.updateMyUsername(newUsername.trim());
      alert('사용자명이 성공적으로 변경되었습니다. 새 사용자명으로 다시 로그인해주세요.');
      // Logout and redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      navigate('/login');
    } catch (error: any) {
      console.error('Failed to update username:', error);
      alert(error.response?.data?.message || '사용자명 변경에 실패했습니다.');
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('모든 비밀번호 필드를 입력하세요.');
      return;
    }

    if (newPassword.length < 6) {
      alert('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setChangingPassword(true);
      await userApi.changeMyPassword(currentPassword, newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">내 프로필</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">프로필 정보를 관리하세요</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Photo */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">프로필 사진</h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.name.charAt(0)}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Camera className="w-5 h-5 mr-2" />
                사진 업로드
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG 파일 (최대 5MB)</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <UserIcon className="w-4 h-4 mr-2" />
                이름
              </label>
              <input {...register('name', { required: '이름을 입력하세요' })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Award className="w-4 h-4 mr-2" />
                학번
              </label>
              <input {...register('studentId')}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                이메일
              </label>
              <input {...register('email', {
                required: '이메일을 입력하세요',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: '유효한 이메일 주소를 입력하세요' }
              })} type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                전화번호
              </label>
              <input {...register('phone')} type="tel"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
        </motion.div>

        {/* Research Areas */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">연구 분야</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {availableResearchAreas.map((area) => (
              <label key={area} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => toggleResearchArea(area)}
                  className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {area.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowAddAreaModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm hover:shadow-md">
            <Plus className="w-4 h-4" />
            신규 키워드 추가
          </button>
        </motion.div>

        {/* Account Settings */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">계정 설정</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">로그인 사용자명</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">계정 로그인에 사용되는 사용자명</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUsernameModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                변경
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">비밀번호</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">계정 보안을 위해 비밀번호 변경</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                변경
              </button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm hover:shadow-md transition">
            {saving ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />저장 중...</>
            ) : (
              <><Save className="w-5 h-5 mr-2" />저장</>
            )}
          </button>
        </motion.div>
      </form>

      {/* Add Research Area Modal */}
      <AnimatePresence>
        {showAddAreaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">신규 연구분야 추가</h3>
                <button
                  onClick={() => setShowAddAreaModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    연구분야 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="예: Medical_AI"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    설명 (선택사항)
                  </label>
                  <textarea
                    value={newAreaDescription}
                    onChange={(e) => setNewAreaDescription(e.target.value)}
                    placeholder="연구분야에 대한 간단한 설명"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddAreaModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition">
                    취소
                  </button>
                  <button
                    onClick={handleAddResearchArea}
                    disabled={addingArea || !newAreaName.trim()}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2">
                    {addingArea ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />추가 중...</>
                    ) : (
                      <><Plus className="w-5 h-5" />추가</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Username Change Modal */}
      <AnimatePresence>
        {showUsernameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Key className="w-6 h-6 text-blue-600" />
                  사용자명 변경
                </h3>
                <button
                  onClick={() => {
                    setShowUsernameModal(false);
                    setNewUsername('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ 사용자명 변경 후 새 사용자명으로 다시 로그인해야 합니다.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    새 사용자명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="최소 3자 이상"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUsernameModal(false);
                      setNewUsername('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition">
                    취소
                  </button>
                  <button
                    onClick={handleUsernameChange}
                    disabled={updatingUsername || !newUsername.trim() || newUsername.trim().length < 3}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2">
                    {updatingUsername ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />변경 중...</>
                    ) : (
                      <><Save className="w-5 h-5" />변경</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-blue-600" />
                  비밀번호 변경
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    현재 비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    새 비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="최소 6자 이상"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    새 비밀번호 확인 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition">
                    취소
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2">
                    {changingPassword ? (
                      <><Loader2 className="w-5 h-5 animate-spin" />변경 중...</>
                    ) : (
                      <><Save className="w-5 h-5" />변경</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
