import { Routes, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './layout/AdminLayout.jsx';
import Announcements from './pages/Announcements';
import Students from './pages/Students';
import CertificateManagement from './pages/CertificateManagement';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Support from './pages/Support';
import Courses from './pages/Courses';
import StudentDetailPage from './pages/StudentDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from '@/common/components/ProtectedRoute';

const AdminPortal = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute loginPath="admin/login" />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/students" element={<Students />} />
          <Route path="/certificate" element={<CertificateManagement />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Route>

      <Route path="/student/:studentId" element={<StudentDetailPage />} />
    </Routes>
  );
};

export default AdminPortal;

