import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthStore } from './store/authStore';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfessorPage from './pages/ProfessorPage';
import PublicationsPage from './pages/PublicationsPage';
import MembersPage from './pages/MembersPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ResearchersPage from './pages/ResearchersPage';
import ProfilePage from './pages/ProfilePage';
import MyProjectsPage from './pages/MyProjectsPage';
import MyTasksPage from './pages/MyTasksPage';
import NoticesPage from './pages/NoticesPage';
import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import BoardFormPage from './pages/BoardFormPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/professor" element={<ProfessorPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/members" element={<MembersPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Layout>
                  <ProjectsPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ProjectDetailPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/researchers"
            element={
              <PrivateRoute>
                <Layout>
                  <ResearchersPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/my-projects"
            element={
              <PrivateRoute>
                <Layout>
                  <MyProjectsPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/my-tasks"
            element={
              <PrivateRoute>
                <Layout>
                  <MyTasksPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/notices"
            element={
              <PrivateRoute>
                <Layout>
                  <NoticesPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/user/boards"
            element={
              <PrivateRoute>
                <Layout>
                  <BoardListPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/user/boards/new"
            element={
              <PrivateRoute>
                <Layout>
                  <BoardFormPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/user/boards/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <BoardDetailPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/user/boards/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <BoardFormPage />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
