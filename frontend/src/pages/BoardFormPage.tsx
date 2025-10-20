import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, X, FileText, File as FileIcon } from 'lucide-react';
import { userBoardsApi, fileUploadApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export default function BoardFormPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isEditMode = Boolean(id && id !== 'new');

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (isEditMode) {
      loadBoard();
    }
  }, [id, user]);

  const loadBoard = async () => {
    try {
      setInitialLoading(true);
      const board = await userBoardsApi.getById(Number(id));

      // Check if current user is the author
      if (board.authorId !== user?.researcherId) {
        alert('수정 권한이 없습니다.');
        navigate('/user/boards');
        return;
      }

      setTitle(board.title);
      setContent(board.content);
      if (board.imageUrl) {
        setFileUrl(board.imageUrl);
        // Extract filename from URL
        const urlParts = board.imageUrl.split('/');
        setFileName(urlParts[urlParts.length - 1]);
      }
    } catch (error) {
      console.error('Failed to load board:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      navigate('/user/boards');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);

      // 서버에 업로드
      const uploadedUrl = await fileUploadApi.uploadImage(file);
      setFileUrl(uploadedUrl);
      setFileName(file.name);
      setAttachedFile(file);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileUrl('');
    setFileName('');
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    if (imageExts.includes(ext || '')) {
      return <FileIcon className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const isImageFile = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExts.includes(ext || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const boardData = {
        title,
        content,
        isPublic: false, // 모든 게시글은 연구실 멤버만 볼 수 있음
        imageUrl: fileUrl || undefined, // 파일 URL (이미지 및 기타 파일)
      };

      if (isEditMode) {
        await userBoardsApi.update(Number(id), boardData);
        alert('게시글이 수정되었습니다.');
      } else {
        await userBoardsApi.create(boardData);
        alert('게시글이 작성되었습니다.');
      }

      navigate('/user/boards');
    } catch (error) {
      console.error('Failed to save board:', error);
      alert(`게시글 ${isEditMode ? '수정' : '작성'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? '게시글 수정' : '게시글 작성'}
          </h1>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={200}
            />
            <p className="mt-1 text-sm text-gray-500 text-right">
              {title.length} / 200
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={15}
            />
            <p className="mt-1 text-sm text-gray-500 text-right">
              {content.length} 자
            </p>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              첨부 파일
            </label>

            {fileName && fileUrl ? (
              <div className="border border-gray-300 rounded-lg p-4">
                {isImageFile(fileName) ? (
                  // 이미지 파일인 경우 미리보기 표시
                  <div className="relative">
                    <img
                      src={fileUrl}
                      alt="미리보기"
                      className="max-w-full h-auto rounded-lg border border-gray-300"
                      style={{ maxHeight: '400px' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  // 일반 파일인 경우 파일 정보 표시
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(fileName)}
                      <div>
                        <p className="font-medium text-gray-900">{fileName}</p>
                        {attachedFile && (
                          <p className="text-sm text-gray-500">
                            {(attachedFile.size / 1024).toFixed(2)} KB
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFile}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploadingFile ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                      <p className="text-gray-600">업로드 중...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-600">클릭하여 파일 업로드</p>
                      <p className="text-sm text-gray-500 mt-1">
                        모든 파일 형식 지원
                      </p>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? '수정하기' : '작성하기'}
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-blue-50 rounded-lg p-4"
        >
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            작성 가이드
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 제목은 명확하고 간결하게 작성해주세요.</li>
            <li>• 내용은 자유롭게 작성하되, 상대방을 존중하는 표현을 사용해주세요.</li>
            <li>• 모든 게시글은 연구실 멤버만 확인할 수 있습니다.</li>
            <li>• 파일을 첨부할 수 있습니다 (모든 형식 지원).</li>
            <li>• 작성 후 수정 및 삭제가 가능합니다.</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
