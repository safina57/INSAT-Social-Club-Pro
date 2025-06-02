import "./index.css";
import {
  useParams,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
import HomePage from "./pages/home";
import MessagesPage from "./components/messages";
import ContactPage from "./components/contact-us";
import NotFound from "./components/404page";
import AdminDashboard from "./components/admin-dashboard";
import JobsPage from "./components/jobs";
import SearchPage from "./components/search";
import EmailVerification from "./components/verify-email";
import ResetPassword from "./components/reset-password";
import ForgotPassword from "./components/forgot-password";
import ResendVerification from "./components/resend-verification";
import AuthInitializer from "./components/auth/AuthInitializer";
import { RequireAuth } from "./components/require-auth";
import { RequireAdmin } from "./components/require-admin";
import ProfilePage from "./pages/profile";
import EditProfilePage from "./pages/edit-profile";
import CreateJobPage from "./pages/CreateJobPage";
import JobManagementPage from "./pages/JobManagementPage";
import { JobApplicantsPage } from "./components/jobs/JobApplicantsPage";
import AdminReports from "./components/admin/reports";

function ProfilePageWrapper() {
  const { id } = useParams<{ id: string }>();
  return <ProfilePage params={{ id: id || "" }} />;
}

function App() {
  return (
    <Router>
      <AuthInitializer />
      <main>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          {/* Sign In Page */}
          <Route path="/signin" element={<SignIn />} />
          {/* Sign Up Page */}
          <Route path="/signup" element={<SignUp />} />
          {/* Email Verification Page */}
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/send-verification-email"
            element={<ResendVerification />}
          />
          {/* Home Page */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          {/* Messages Page */}
          <Route
            path="/messages"
            element={
              <RequireAuth>
                <MessagesPage />
              </RequireAuth>
            }
          />
          {/* Contact Us Page */}
          <Route path="/contact-us" element={<ContactPage />} />
          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/reports"
            element={
              <RequireAdmin>
                <AdminReports />
              </RequireAdmin>
            }
          />
          {/* Admin Dashboard */}
          {/* Jobs Page */}
          <Route
            path="/jobs"
            element={
              <RequireAuth>
                <JobsPage />
              </RequireAuth>
            }
          />{" "}
          {/* Create Job Page */}
          <Route
            path="/jobs/create"
            element={
              <RequireAuth>
                <CreateJobPage />
              </RequireAuth>
            }
          />{" "}
          {/* Job Management Dashboard */}
          <Route
            path="/jobs/manage"
            element={
              <RequireAuth>
                <JobManagementPage />
              </RequireAuth>
            }
          />
          {/* Job Applicants Page */}
          <Route
            path="/jobs/:jobId/applicants"
            element={
              <RequireAuth>
                <JobApplicantsPage />
              </RequireAuth>
            }
          />
          {/* Profile Page */}
          <Route
            path="/profile/:id"
            element={
              <RequireAuth>
                <ProfilePageWrapper />
              </RequireAuth>
            }
          />
          {/* Edit Profile Page */}
          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <EditProfilePage />
              </RequireAuth>
            }
          />
          {/* Search Page */}
          <Route path="/search" element={<SearchPage />} />
          {/* Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}
export default App;
