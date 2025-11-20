import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './layout/AdminLayout.jsx';
import Announcements from './pages/Announcements';
import Students from './pages/Students';
import CertificateManagement from './pages/CertificateManagement';

const AdminPortal = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/students" element={<Students />} />
        <Route path="/certificate" element={<CertificateManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminPortal;

