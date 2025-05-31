import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';
import HomePage from './components/home'; 
import MessagesPage from './components/messages';
import ContactPage from './components/contact-us';
import NotFound from './components/404page';
import AdminDashboard from './components/admin-dashboard';
import EmailVerification from './components/verify-email';
import ResetPassword from './components/reset-password';
import ForgotPassword from './components/forgot-password';
import ResendVerification from './components/resend-verification';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Sign In Page */}  
          <Route
            path="/signin"
            element={<SignIn />}
          />

          {/* Sign Up Page */}
          <Route
            path="/signup"
            element={<SignUp />}
          />

          {/* Email Verification Page */}
          <Route
            path="/verify-email"
            element={<EmailVerification />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/send-verification-email"
            element={<ResendVerification />}
          />

          {/* Home Page */}
          <Route
            path="/home"
            element={<HomePage />}
          />
              
          {/* Messages Page */}
          <Route
            path="/messages"
            element={<MessagesPage />}
          />

          {/* Contact Us Page */}
          <Route
            path="/contact-us"
            element={<ContactPage />}
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* Catch-All Route */}
        <Route
          path="*"
          element={
            <NotFound />
          }
        />
        </Routes>  
      </main>
    </Router>  
  );
} 
export default App;
