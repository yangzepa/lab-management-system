import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Megaphone, Globe, Lock, Upload, FileText, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { noticesApi, fileUploadApi, userApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { Notice } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NoticesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
    imageUrl: '',
    attachmentUrl: '',
    attachmentName: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadNotices();
  }, [currentPage, searchKeyword]);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await noticesApi.getAll(currentPage, 10)
        : await userApi.getNotices(currentPage, 10);
      setNotices(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(0);
  };

  const handleRowClick = (notice: Notice) => {
    setViewingNotice(notice);
    setShowDetailModal(true);
  };

  const handleOpenModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        isPublic: notice.isPublic,
        imageUrl: notice.imageUrl || '',
        attachmentUrl: notice.attachmentUrl || '',
        attachmentName: notice.attachmentName || '',
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        content: '',
        isPublic: true,
        imageUrl: '',
        attachmentUrl: '',
        attachmentName: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      isPublic: true,
      imageUrl: '',
      attachmentUrl: '',
      attachmentName: '',
    });
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingNotice(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await fileUploadApi.uploadImage(file);
      setFormData({ ...formData, imageUrl });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    try {
      setUploadingFile(true);
      const result = await fileUploadApi.uploadFile(file);
      setFormData({
        ...formData,
        attachmentUrl: result.fileUrl,
        attachmentName: result.originalName
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await noticesApi.update(editingNotice.id, formData);
        alert('공지사항이 수정되었습니다.');
      } else {
        await noticesApi.create(formData);
        alert('공지사항이 등록되었습니다.');
      }
      handleCloseModal();
      loadNotices();
    } catch (error) {
      console.error('Failed to save notice:', error);
      alert('공지사항 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await noticesApi.delete(id);
      alert('공지사항이 삭제되었습니다.');
      loadNotices();
    } catch (error) {
      console.error('Failed to delete notice:', error);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

  if (loading && notices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
            {isAdmin && (
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                새 공지 작성
              </button>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="제목으로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            >
              검색
            </button>
          </form>
        </motion.div>

        {/* Notice Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {notices.length === 0 ? (
            <div className="p-12 text-center">
              <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchKeyword ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    작성일
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      관리
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.map((notice, index) => (
                  <motion.tr
                    key={notice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleRowClick(notice)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {totalPages > 0
                        ? (totalPages - currentPage) * 10 - index
                        : index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="font-medium hover:text-blue-600 transition line-clamp-1">
                          {notice.title}
                        </span>
                        {!notice.isPublic && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            비공개
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notice.authorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(notice);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, notice.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              이전
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const pageGroup = Math.floor(currentPage / 10);
                const pageNum = pageGroup * 10 + i;
                if (pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && viewingNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {viewingNotice.title}
                  </h2>
                  {viewingNotice.isPublic ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Globe className="w-3 h-3" />
                      공개
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      <Lock className="w-3 h-3" />
                      비공개
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
                  <span>작성자: {viewingNotice.authorName}</span>
                  <span>•</span>
                  <span>{new Date(viewingNotice.createdAt).toLocaleString('ko-KR')}</span>
                </div>

                {viewingNotice.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={viewingNotice.imageUrl}
                      alt={viewingNotice.title}
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {viewingNotice.attachmentUrl && viewingNotice.attachmentName && (
                  <div className="mb-6">
                    <a
                      href={viewingNotice.attachmentUrl}
                      download={viewingNotice.attachmentName}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">{viewingNotice.attachmentName}</span>
                    </a>
                  </div>
                )}

                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="ml-4" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                      code: ({node, inline, ...props}: any) =>
                        inline ?
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} /> :
                          <code className="block bg-gray-100 p-4 rounded my-4 overflow-x-auto" {...props} />,
                      table: ({node, ...props}) => <table className="border-collapse border border-gray-300 w-full my-4" {...props} />,
                      th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
                      td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    }}
                  >
                    {viewingNotice.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNotice ? '공지사항 수정' : '새 공지 작성'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="공지사항 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    placeholder="공지사항 내용을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    첨부 이미지
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {uploading ? '업로드 중...' : '이미지 선택'}
                      </span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        제거
                      </button>
                    )}
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    첨부 파일
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {uploadingFile ? '업로드 중...' : '파일 선택'}
                      </span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="hidden"
                      />
                    </label>
                    {formData.attachmentUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attachmentUrl: '', attachmentName: '' })}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        제거
                      </button>
                    )}
                  </div>
                  {formData.attachmentName && (
                    <div className="mt-3 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{formData.attachmentName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-700">
                        공개 공지사항
                      </span>
                      <p className="text-xs text-gray-500">
                        체크하면 외부 랜딩페이지에도 표시됩니다
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingNotice ? '수정' : '등록'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
