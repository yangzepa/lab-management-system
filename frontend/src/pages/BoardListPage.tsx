import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { userBoardsApi, boardsApi } from '@/services/api';
import type { Board } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadBoards();
  }, [currentPage, searchKeyword]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = searchKeyword
        ? await userBoardsApi.search(searchKeyword, currentPage, 10)
        : await userBoardsApi.getAll(currentPage, 10);

      setBoards(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(0);
  };

  const handleCreatePost = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/user/boards/new');
  };

  const handleDelete = async (e: React.MouseEvent, boardId: number) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await boardsApi.delete(boardId);
      alert('삭제되었습니다.');
      loadBoards();
    } catch (error) {
      console.error('Failed to delete board:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading && boards.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">자유게시판</h1>
            <button
              onClick={handleCreatePost}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              글쓰기
            </button>
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

        {/* Board Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {boards.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchKeyword ? '검색 결과가 없습니다.' : '작성된 게시글이 없습니다.'}
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    조회
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    댓글
                  </th>
                  {user?.role === 'ADMIN' && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      관리
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {boards.map((board, index) => (
                  <motion.tr
                    key={board.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => navigate(`/user/boards/${board.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {totalPages > 0
                        ? (totalPages - currentPage) * 10 - index
                        : index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-medium hover:text-blue-600 transition line-clamp-1">
                        {board.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {board.authorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(board.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {board.viewCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {board.commentCount}
                      </div>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          onClick={(e) => handleDelete(e, board.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
    </div>
  );
}
