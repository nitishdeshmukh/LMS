import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import StudentSidebar from '../components/StudentSidebar';
import StudentTopBar from '../components/StudentTopBar';

import {
  selectStudentSidebarOpen,
  selectCurrentNavigation,
  setStudentSidebarOpen,
} from '@/redux/slices';

const StudentLayout = () => {
  const dispatch = useDispatch();
  const studentSidebarOpen = useSelector(selectStudentSidebarOpen);
  const currentNavigation = useSelector(selectCurrentNavigation);

  // Check if we're on the learning page (my-courses/:coursename)
  const isLearningPage = currentNavigation.split('/').at(-2) === 'my-courses';

  const handleOverlayClick = () => {
    dispatch(setStudentSidebarOpen(false));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay - closes sidebar when clicking outside */}
      {studentSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={handleOverlayClick}
        />
      )}
      <div
        className={`z-40 absolute md:static h-screen shrink-0 overflow-hidden transition-all ${studentSidebarOpen ? 'w-64' : 'w-0'}`}
      >
        <StudentSidebar />
      </div>
      <div className={`grow flex flex-col ${isLearningPage ? 'overflow-hidden' : 'overflow-auto'}`}>
        <div className="w-full shrink-0 sticky top-0 z-10">
          <StudentTopBar />
        </div>
        <div className={`grow ${isLearningPage ? 'overflow-hidden' : 'container mx-auto'}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
