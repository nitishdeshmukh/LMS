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

const AdminPortal = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/students" element={<Students />} />
        <Route path="/certificate" element={<CertificateManagement />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
      </Route>
      <Route path="/student/:studentId" element={<StudentDetailPage />} />
    </Routes>
  );
};

export default AdminPortal;

