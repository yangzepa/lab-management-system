import { useEffect, useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { X, Calendar, Clock, AlertCircle, User, Check, ChevronDown, Loader2, MessageSquare, Send, Trash2 } from 'lucide-react';
import { tasksApi, userApi, commentsApi, publicApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { Task, Researcher, Comment } from '@/types';

interface Props {
  task: Task | null;
  projectId: number;
  onClose: () => void;
  onSave: () => void;
}

const statusOptions = [
  { id: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: '📋' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: '🚀' },
  { id: 'DONE', label: 'Done', color: 'bg-green-100 text-green-800', icon: '✅' },
  { id: 'BLOCKED', label: 'Blocked', color: 'bg-red-100 text-red-800', icon: '🚫' },
];

const priorityOptions = [
  { id: 'HIGH', label: 'High Priority', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'MEDIUM', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'LOW', label: 'Low Priority', color: 'bg-green-100 text-green-800 border-green-200' },
];

export default function TaskModal({ task, projectId, onClose, onSave }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';
  const [loading, setLoading] = useState(false);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [selectedResearchers, setSelectedResearchers] = useState<Researcher[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(
    statusOptions.find((s) => s.id === (task?.status || 'TODO'))!
  );
  const [selectedPriority, setSelectedPriority] = useState(
    priorityOptions.find((p) => p.id === (task?.priority || 'MEDIUM'))!
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: task || {
      name: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      projectId,
    },
  });

  useEffect(() => {
    loadResearchers();
    if (task?.assignees) {
      setSelectedResearchers(task.assignees);
    }
    if (task?.id) {
      loadComments();
    }
  }, [task?.id]);

  const loadResearchers = async () => {
    try {
      const data = await publicApi.getResearchers();
      setResearchers(data);
    } catch (error) {
      console.error('Failed to load researchers:', error);
    }
  };

  const loadComments = async () => {
    if (!task?.id) return;
    try {
      const data = await commentsApi.getTaskComments(task.id);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!task?.id || !newComment.trim()) return;
    try {
      await commentsApi.createComment(task.id, newComment.trim());
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await commentsApi.deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const taskData = {
        ...data,
        status: selectedStatus.id,
        priority: selectedPriority.id,
        assigneeIds: selectedResearchers.map((r) => r.id),
      };

      if (task) {
        // Update: Admin uses admin API, users use user API
        if (isAdmin) {
          await tasksApi.update(task.id, taskData);
        } else {
          await userApi.updateTask(projectId, task.id, taskData);
        }
      } else {
        // Create: Admin uses admin API, users use user API
        if (isAdmin) {
          taskData.projectId = projectId;
          await tasksApi.create(taskData);
        } else {
          await userApi.createTask(projectId, taskData);
        }
      }
      onSave();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('태스크 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                      {task ? '태스크 수정' : '새 태스크 생성'}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-lg p-1 text-gray-400 hover:bg-white/50 hover:text-gray-600 transition"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  {/* Task Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      태스크명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { required: '태스크명을 입력하세요' })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="예: API 개발, 테스트 작성..."
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name.message as string}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      설명
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="태스크에 대한 자세한 설명을 입력하세요..."
                    />
                  </div>

                  {/* Status and Priority Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        상태
                      </label>
                      <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                        <div className="relative">
                          <Listbox.Button className="relative w-full rounded-xl bg-white py-3 pl-4 pr-10 text-left border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <span className="flex items-center gap-2">
                              <span>{selectedStatus.icon}</span>
                              <span className="block truncate">{selectedStatus.label}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {statusOptions.map((status) => (
                                <Listbox.Option
                                  key={status.id}
                                  value={status}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                    }`
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className="flex items-center gap-2">
                                        <span>{status.icon}</span>
                                        <span className={selected ? 'font-medium' : 'font-normal'}>
                                          {status.label}
                                        </span>
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <Check className="h-5 w-5" />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        우선순위
                      </label>
                      <Listbox value={selectedPriority} onChange={setSelectedPriority}>
                        <div className="relative">
                          <Listbox.Button className="relative w-full rounded-xl bg-white py-3 pl-4 pr-10 text-left border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <span className="block truncate">{selectedPriority.label}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {priorityOptions.map((priority) => (
                                <Listbox.Option
                                  key={priority.id}
                                  value={priority}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                    }`
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={selected ? 'font-medium' : 'font-normal'}>
                                        {priority.label}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <Check className="h-5 w-5" />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>

                  {/* Date and Hours Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        마감일
                      </label>
                      <input
                        {...register('dueDate')}
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        예상 시간 (시간)
                      </label>
                      <input
                        {...register('estimatedHours')}
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  {/* Assignees */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      담당자 ({selectedResearchers.length}명 선택)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border-2 border-gray-200 rounded-xl">
                      {researchers.map((researcher) => {
                        const isSelected = selectedResearchers.some((r) => r.id === researcher.id);
                        return (
                          <button
                            key={researcher.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedResearchers(
                                  selectedResearchers.filter((r) => r.id !== researcher.id)
                                );
                              } else {
                                setSelectedResearchers([...selectedResearchers, researcher]);
                              }
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${
                              isSelected
                                ? 'bg-blue-50 border-blue-300 text-blue-900'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                              {researcher.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium truncate">{researcher.name}</span>
                            {isSelected && <Check className="w-4 h-4 ml-auto flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments */}
                  {task && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        댓글 ({comments.length})
                      </label>

                      {/* Comment List */}
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {comment.authorPhotoUrl ? (
                                  <img src={comment.authorPhotoUrl} alt={comment.authorName} className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                    {comment.authorName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString('ko-KR')}
                                  </p>
                                </div>
                              </div>
                              {(isAdmin || comment.authorId === user?.researcherId) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        ))}
                        {comments.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">아직 댓글이 없습니다.</p>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                          placeholder="댓글을 입력하세요..."
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <button
                          type="button"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm hover:shadow-md transition flex items-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
