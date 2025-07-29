import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from '@/components/navbar';
import Home from '@/pages/Home';
import About from '@/pages/About';
import QuizApp from '@/pages/QuizApp';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Topics from '@/pages/Topics';
import Results from '@/pages/Results';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('ProtectedRoute check:', { tokenExists: !!token, userRole: user.role, requireAdmin }); // Debug log
  if (!token) {
    console.log('No token, redirecting to /login'); // Debug log
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }
  if (requireAdmin && user.role !== 'admin') {
    console.log('Non-admin user, redirecting to /:', user.role); // Debug log
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/topics" element={<Topics />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute>
                <QuizApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;