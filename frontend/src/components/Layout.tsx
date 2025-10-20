import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  LogOut,
  Menu,
  Moon,
  Sun,
  Settings,
  ClipboardList,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  children: ReactNode;
}

// Admin navigation
const adminMainNavigation = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '프로젝트', href: '/projects', icon: FolderKanban },
  { name: '연구원', href: '/researchers', icon: Users },
  { name: '공지사항', href: '/notices', icon: Megaphone },
  { name: '자유게시판', href: '/user/boards', icon: MessageSquare },
  { name: '내 프로필', href: '/profile', icon: Settings },
];

// Researcher navigation
const researcherNavigation = [
  { name: '프로젝트', href: '/projects', icon: FolderKanban },
  { name: '내 프로젝트', href: '/my-projects', icon: FolderKanban },
  { name: '내 태스크', href: '/my-tasks', icon: ClipboardList },
  { name: '공지사항', href: '/notices', icon: Megaphone },
  { name: '자유게시판', href: '/user/boards', icon: MessageSquare },
  { name: '내 프로필', href: '/profile', icon: Settings },
];

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar - Desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Lab Management</h1>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-4">
              {/* Main Navigation - Different for Admin and Researcher */}
              <div className="space-y-1">
                {(user?.role === 'ADMIN' ? adminMainNavigation : researcherNavigation).map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5" />
                    다크 모드
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" />
                    라이트 모드
                  </>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{user?.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            {/* Same content as desktop sidebar */}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden flex items-center gap-4 px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Lab Management</h1>
        </div>

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
