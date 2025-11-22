import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
