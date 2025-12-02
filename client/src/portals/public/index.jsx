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
import Fullstack from './pages/Fullstacksalespage.jsx';
import FrontEnd from './pages/FrontEndsalespage.jsx';
import BackEnd from './pages/Backendsalespage.jsx';
import DataBase from './pages/DataBaseSalesPage.jsx';
import DataAnalytics from './pages/DataAnalyticsSalesPage.jsx';
import DataScience from './pages/DataScienceSalesPage.jsx';
import Python from './pages/PythonSalePage.jsx';
import MobileDev from './pages/MobileDevSalesPage.jsx';
import UX from './pages/UXSalesPage.jsx';
import AboutUs from './pages/AboutUSPage.jsx';
import EnrollmentDetails from './pages/EnrollmentForm.jsx';
import EnrollmentPayment from './pages/EnrollmentPayment.jsx';
import Github from './pages/VersionControlWithGit.jsx';

import PageNotFound from '@/common/pages/PageNotFound.jsx';
import AuthSuccess from './pages/AuthSuccess.jsx';
import ProtectedRoute from '@/common/components/ProtectedRoute.jsx';

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
          <Route path="/fullstack" element={<Fullstack />} />
          <Route path="/frontend" element={<FrontEnd />} />
          <Route path="/backend" element={<BackEnd />} />
          <Route path="/database" element={<DataBase />} />
          <Route path="/dataanalytics" element={<DataAnalytics />} />
          <Route path="/datascience" element={<DataScience />} />
          <Route path="/python" element={<Python />} />
          <Route path="/mobiledev" element={<MobileDev />} />
          <Route path="/ux" element={<UX />} />
          <Route path="/github" element={<Github />} />
          <Route
            path="/enroll"
            element={
              <ProtectedRoute>
                <EnrollmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enroll/payment"
            element={
              <ProtectedRoute>
                <EnrollmentPayment />
              </ProtectedRoute>
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

