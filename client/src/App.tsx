 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from '@/components/navbar';
import Home from '@/pages/Home';
import About from '@/pages/About';
import QuizApp from '@/pages/QuizApp';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Topics from '@/pages/Topics';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" state={{ from: window.location.pathname }} />;
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
          <Route path="/Topics" element={<Topics />} />
          <Route
            path="/questions"
            element={
              <ProtectedRoute>
                <QuizApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
