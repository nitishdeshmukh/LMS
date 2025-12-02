import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import CampusAmbassador from './pages/CampusAmbassador.jsx';
import Events from './pages/EventsPage.jsx';
import BrowseStreams from './pages/BrowseStreamsPage.jsx';
import Pricing from './pages/PricingPage.jsx';
import Verification from './pages/VerificationPage.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import AboutUs from './pages/AboutUSPage.jsx';
import EnrollmentDetails from './pages/EnrollmentForm.jsx';
import EnrollmentPayment from './pages/EnrollmentPayment.jsx';
import PageNotFound from '@/common/pages/PageNotFound.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import PublicProtectedRoute from '@/common/components/PublicProtectedRoute.jsx';
import AuthSuccess from '@/portals/public/pages/AuthSuccess.jsx';

const PublicPortal = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/campus" element={<CampusAmbassador />} />
          <Route path="/events" element={<Events />} />
          <Route path="/browse" element={<BrowseStreams />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route
            path="/enroll"
            element={
              <PublicProtectedRoute>
                <EnrollmentDetails />
              </PublicProtectedRoute>
            }
          />
          <Route
            path="/enroll/payment"
            element={
              <PublicProtectedRoute>
                <EnrollmentPayment />
              </PublicProtectedRoute>
            }
          />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default PublicPortal;
