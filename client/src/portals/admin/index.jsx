import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './layout/AdminLayout.jsx';
import Certificate from './pages/Certificate';
import Student from './pages/Student';

const AdminPortal = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/student" element={<Student />} />
        <Route path="/certificate" element={<Certificate />} />
      </Route>
    </Routes>
  );
};

export default AdminPortal;
