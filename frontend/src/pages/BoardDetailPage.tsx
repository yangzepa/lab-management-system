import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Calendar, User, Edit, Trash2, MessageSquare, Send, Download, FileText } from 'lucide-react';
import { userBoardsApi } from '@/services/api';
import type { Board, BoardComment } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (id) {
      loadBoard();
      loadComments();
    }
  }, [id]);

  const loadBoard = async () => {
    try {
      const data = await userBoardsApi.getById(Number(id));
      setBoard(data);
    } catch (error) {
      console.error('Failed to load board:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      navigate('/user/boards');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await userBoardsApi.getComments(Number(id));
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await userBoardsApi.delete(Number(id));
      alert('게시글이 삭제되었습니다.');
      navigate('/user/boards');
    } catch (error) {
      console.error('Failed to delete board:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await userBoardsApi.createComment(Number(id), commentContent);
      setCommentContent('');
      loadComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editingCommentContent.trim()) return;

    try {
      await userBoardsApi.updateComment(commentId, editingCommentContent);
      setEditingCommentId(null);
      setEditingCommentContent('');
      loadComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await userBoardsApi.deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const startEditComment = (comment: BoardComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const isImageFile = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExts.includes(ext || '');
  };

  const getFileName = () => {
    return board?.attachmentName || board?.imageUrl?.split('/').pop() || 'file';
  };

  if (loading || !board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAuthor = user && board.authorId === user.researcherId;

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
            onClick={() => navigate('/user/boards')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            목록으로
          </button>
        </motion.div>

        {/* Board Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-6"
        >
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
              {!board.isPublic && (
                <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                  비공개
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 pb-6 border-b">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {board.authorName}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(board.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {board.viewCount}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {comments.length}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {board.content}
            </div>

            {/* Attached Files */}
            {(board.attachments && board.attachments.length > 0) || board.imageUrl ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  첨부 파일 {board.attachments ? `(${board.attachments.length}개)` : ''}
                </h3>
                <div className="space-y-3">
                  {board.attachments && board.attachments.length > 0 ? (
                    // 여러 파일 표시
                    board.attachments.map((attachment, index) => (
                      <div key={index}>
                        {isImageFile(attachment.url) ? (
                          // 이미지 파일인 경우 미리보기
                          <div>
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                              style={{ maxHeight: '600px' }}
                            />
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-gray-600">{attachment.name}</p>
                              <a
                                href={attachment.url}
                                download
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                다운로드
                              </a>
                            </div>
                          </div>
                        ) : (
                          // 일반 파일인 경우 다운로드 링크
                          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <FileText className="w-8 h-8 text-gray-500 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-xs text-gray-500">첨부파일</p>
                            </div>
                            <a
                              href={attachment.url}
                              download
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              다운로드
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  ) : board.imageUrl ? (
                    // 단일 파일 표시 (하위 호환성)
                    isImageFile(board.imageUrl) ? (
                      <div>
                        <img
                          src={board.imageUrl}
                          alt="첨부 이미지"
                          className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                          style={{ maxHeight: '600px' }}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-600">{getFileName()}</p>
                          <a
                            href={board.imageUrl}
                            download
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="w-8 h-8 text-gray-500 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{getFileName()}</p>
                          <p className="text-xs text-gray-500">첨부파일</p>
                        </div>
                        <a
                          href={board.imageUrl}
                          download
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          다운로드
                        </a>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          {/* Actions */}
          {isAuthor && (
            <div className="flex items-center space-x-2 pt-6 border-t">
              <button
                onClick={() => navigate(`/user/boards/${board.id}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4 mr-2" />
                수정
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </button>
            </div>
          )}
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            댓글 {comments.length}개
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCreateComment} className="mb-8">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 작성하세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentContent.trim()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4 mr-2" />
                  댓글 작성
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
              댓글을 작성하려면 로그인이 필요합니다.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                첫 번째 댓글을 작성해보세요!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {comment.authorName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    {user && comment.authorId === user.researcherId && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditComment(comment)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingCommentContent('');
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
