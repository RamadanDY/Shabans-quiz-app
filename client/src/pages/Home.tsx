 import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import image from "@/assets/boOHVtyN.jpeg";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const handleQuizClick = () => {
    navigate('/Topics');
  };

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location } });
  };

  const handleRegisterClick = () => {
    navigate('/register', { state: { from: location } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center relative overflow-hidden" style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl text-gray-300 font-math">π</div>
        <div className="absolute bottom-20 right-20 text-5xl text-gray-300 font-math">Σ</div>
        <div className="absolute top-1/3 left-1/4 text-4xl text-gray-300 font-math">∞</div>
        <div className="absolute bottom-1/3 right-1/4 text-5xl text-gray-300 font-math">∫</div>
      </div>

      <div className="text-center px-4 max-w-4xl z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-4 animate-fade-in">
          Welcome to Shaban's Maths Quiz
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 animate-slide-up">
          Challenge your math skills with fun and engaging quizzes! From basic arithmetic to advanced algebra, test your knowledge and learn something new.
        </p>
        {user ? (
          <Button
            onClick={handleQuizClick}
            className="bg-blue-600 text-white px-8 py-3 text-lg rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Start the Quiz
          </Button>
        ) : (
          <div className="flex space-x-4 justify-center">
            <Button
              onClick={handleLoginClick}
              className="bg-blue-600 text-white px-8 py-3 text-lg rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Button>
            <Button
              onClick={handleRegisterClick}
              className="bg-green-600 text-white px-8 py-3 text-lg rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Register
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl z-10">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up delay-100">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Did You Know?</h3>
          <p className="text-gray-600">
            The number π (pi) is approximately 3.14159 and is used in countless mathematical calculations, from circles to waves!
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up delay-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Fun Fact</h3>
          <p className="text-gray-600">
            Zero is neither positive nor negative and was invented independently by the Babylonians, Mayans, and Indians.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-slide-up delay-300">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Math Challenge</h3>
          <p className="text-gray-600">
            Can you solve equations faster than your friends? Start the quiz to find out!
          </p>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');
        .font-math {
          font-family: 'Roboto Slab', serif;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
 dwindle-y;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-in-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home;