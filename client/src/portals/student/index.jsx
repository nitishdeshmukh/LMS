import { Routes, Route } from 'react-router-dom';

import StudentLayout from './layout/StudentLayout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentMyCoursesPage from './pages/StudentMyCoursesPage';
import StudentCurrentLearningPage from './pages/StudentCurrentLearningPage';
import StudentAssignmentsPage from './pages/StudentAssignmentsPage';
import StudentQuizzesPage from './pages/StudentQuizzesPage';
import StudentLeaderboardPage from './pages/StudentLeaderBoardPage';
import StudentCertificatesPage from './pages/StudentCertificatesPage';
import StudentReferandEarnPage from './pages/StudentReferandEarnPage';
import StudentSupportPage from './pages/StudentSupportPage';
import StudentSettingsPage from './pages/StudentSettingsPage';
import StudentProfilePage from './pages/StudentProfilePage';

const StudentPortal = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/" element={<StudentDashboardPage />} />
        <Route path="/my-courses" element={<StudentMyCoursesPage />} />
        <Route path="/current-learning" element={<StudentCurrentLearningPage />} />
        <Route path="/assignments" element={<StudentAssignmentsPage />} />
        <Route path="/quizzes" element={<StudentQuizzesPage />} />
        <Route path="/leaderboard" element={<StudentLeaderboardPage />} />
        <Route path="/certificates" element={<StudentCertificatesPage />} />
        <Route path="/refer-and-earn" element={<StudentReferandEarnPage />} />
        <Route path="/support" element={<StudentSupportPage />} />
        <Route path="/settings" element={<StudentSettingsPage />} />
        <Route path="/profile" element={<StudentProfilePage />} />
      </Route>
    </Routes>
  );
};

export default StudentPortal;
