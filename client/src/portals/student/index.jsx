import { Routes, Route } from 'react-router-dom';

import StudentLayout from './layout/StudentLayout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentMyCoursesPage from './pages/StudentMyCoursesPage';
import StudentLearningPage from './pages/StudentLearningPage';
import StudentAssignmentsPage from './pages/StudentAssignmentsPage';
import StudentCourseAssignmentsPage from './pages/StudentCourseAssignmentsPage';
import StudentCourseQuizzesPage from './pages/StudentCourseQuizzesPage';
import StudentQuizzesPage from './pages/StudentQuizzesPage';
import StudentLeaderboardPage from './pages/StudentLeaderboardPage';
import StudentCertificatesPage from './pages/StudentCertificatesPage';
import StudentReferandEarnPage from './pages/StudentReferandEarnPage';
import StudentSupportPage from './pages/StudentSupportPage';
import StudentSettingsPage from './pages/StudentSettingsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentCourseCertificatesPage from './pages/StudentCourseCertificatesPage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentLandingPage from './pages/StudentLandingPage';

import ProtectedRoute from '@/common/components/ProtectedRoute';

const StudentPortal = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentLandingPage />} />
      <Route path="/login" element={<StudentLoginPage />} />
      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute loginPath="/student/login" />}>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/my-courses" element={<StudentMyCoursesPage />} />
          <Route path="/my-courses/:coursename" element={<StudentLearningPage />} />
          <Route path="/quizzes" element={<StudentQuizzesPage />} />
          <Route path="/quizzes/:coursename" element={<StudentCourseQuizzesPage />} />
          <Route path="/assignments" element={<StudentAssignmentsPage />} />
          <Route path="/assignments/:coursename" element={<StudentCourseAssignmentsPage />} />
          <Route path="/certificates" element={<StudentCertificatesPage />} />
          <Route path="/certificates/:coursename" element={<StudentCourseCertificatesPage />} />
          <Route path="/leaderboard" element={<StudentLeaderboardPage />} />
          <Route path="/refer-and-earn" element={<StudentReferandEarnPage />} />
          <Route path="/support" element={<StudentSupportPage />} />
          <Route path="/settings" element={<StudentSettingsPage />} />
          <Route path="/profile" element={<StudentProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentPortal;
