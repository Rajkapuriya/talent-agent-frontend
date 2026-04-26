import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import NewJob from './pages/NewJob';
import JobDetail from './pages/JobDetail';
import PipelineRun from './pages/PipelineRun';
import ShortlistPage from './pages/Shortlist';
import CandidatePool from './pages/CandidatePool';
import Login from './pages/Login';

/**
 * ProtectedRoute — redirects to /login if no token present.
 */
function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/**
 * AppShell — authenticated layout with sidebar.
 */
function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-transparent">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            // <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/jobs/new" element={<NewJob />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route
                  path="/pipeline/:jobId/:runId"
                  element={<PipelineRun />}
                />
                <Route path="/shortlist/:jobId" element={<ShortlistPage />} />
                <Route path="/candidates" element={<CandidatePool />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AppShell>
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
