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
import ProfilePage from "./components/profile";
import SearchPage from "./components/search";
import EmailVerification from "./components/verify-email";
import ResetPassword from "./components/reset-password";
import ForgotPassword from "./components/forgot-password";
import ResendVerification from "./components/resend-verification";
import AuthInitializer from "./components/auth/AuthInitializer";
import { RequireAuth } from './components/require-auth'
import { RequireAdmin } from './components/require-admin'

function ProfilePageWrapper() {
  const { username } = useParams<{ username: string }>();
  return <ProfilePage params={{ username: username || "" }} />;
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
          <Route path="/home" element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          } />

          {/* Messages Page */}
          <Route path="/messages" element={
            <RequireAuth>
              <MessagesPage />
            </RequireAuth>
          } />

          {/* Contact Us Page */}
          <Route path="/contact-us" element={
            <RequireAuth>
              <ContactPage />
            </RequireAuth>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            <RequireAuth>
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            </RequireAuth>
          } />

          {/* Jobs Page */}
          <Route path="/jobs" element={
            <RequireAuth>
              <JobsPage />
            </RequireAuth>
          } />

          {/* Profile Page */}
          <Route path="/profile/:username" element={
            <RequireAuth>
              <ProfilePageWrapper />
            </RequireAuth>
          } />
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
