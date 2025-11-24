import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';

const PublicPortal = lazy(() => import('./portals/public'));
const AdminPortal = lazy(() => import('./portals/admin'));
const StudentPortal = lazy(() => import('./portals/student'));

const App = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <LoaderCircle className="animate-spin size-16" />
          </div>
        }
      >
        <Routes>
          <Route path="/*" element={<PublicPortal />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/student/*" element={<StudentPortal />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
