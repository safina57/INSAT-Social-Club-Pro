import './index.css';
import { useParams, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';
import HomePage from './components/home'; 
import MessagesPage from './components/messages';
import ContactPage from './components/contact-us';
import NotFound from './components/404page';
import AdminDashboard from './components/admin-dashboard';
import JobsPage from './components/jobs';
import ProfilePage from './components/profile';
import SearchPage from './components/search';

function ProfilePageWrapper() {
  const { username } = useParams<{ username: string }>();
  return <ProfilePage params={{ username: username || '' }} />;
}

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

          {/* Jobs Page */} 
          <Route
            path="/jobs"
            element={<JobsPage />}
          />

          {/* Profile Page */}
          <Route
            path="/profile/:username"
            element={<ProfilePageWrapper />}
          />

          {/* Search Page */}
          <Route
            path="/search"
            element={<SearchPage />}
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
