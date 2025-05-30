import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';

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

          {/* Catch-All Route */}
        <Route
          path="*"
          element={
            <div>
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
        </Routes>  
      </main>
    </Router>  
  );
} 
export default App;
