import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import * as api from './api';

const AdminDashboard = () => {
  const { user, logout, getAllUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    topic: '',
    questions: [],
    timeLimit: '',
    isActive: true,
    availableFrom: '',
    availableUntil: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await getAllUsers();
        if (usersRes.status === 'success') setUsers(usersRes.data);
        const quizzesRes = await api.getQuizzes();
        if (quizzesRes.status === 'success') setQuizzes(quizzesRes.data);
        const resultsRes = await api.getQuizResults();
        if (resultsRes.status === 'success') setResults(resultsRes.data);
      } catch (err) {
        setError('Failed to load data');
      }
    };
    fetchData();
  }, [getAllUsers]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createQuiz(newQuiz);
      if (res.status === 'success') {
        setQuizzes([...quizzes, res.data]);
        setNewQuiz({
          title: '',
          topic: '',
          questions: [],
          timeLimit: '',
          isActive: true,
          availableFrom: '',
          availableUntil: '',
        });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to create quiz');
    }
  };

  const handleQuizUpdate = async (id, updates) => {
    try {
      const res = await api.updateQuiz(id, updates);
      if (res.status === 'success') {
        setQuizzes(quizzes.map((q) => (q._id === id ? res.data : q)));
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to update quiz');
    }
  };

  const handleQuizDelete = async (id) => {
    try {
      const res = await api.deleteQuiz(id);
      if (res.status === 'success') {
        setQuizzes(quizzes.filter((q) => q._id !== id));
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to delete quiz');
    }
  };

  const handleQuizAvailability = async (id, updates) => {
    try {
      const res = await api.updateQuizAvailability(id, updates);
      if (res.status === 'success') {
        setQuizzes(quizzes.map((q) => (q._id === id ? res.data : q)));
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to update quiz availability');
    }
  };

  const calculateAnalytics = () => {
    const quizScores = results.reduce((acc, result) => {
      const quizId = result.quiz?._id;
      if (!acc[quizId]) acc[quizId] = { total: 0, count: 0 };
      acc[quizId].total += result.score;
      acc[quizId].count += 1;
      return acc;
    }, {});
    return Object.entries(quizScores).map(([quizId, { total, count }]) => ({
      quizId,
      averageScore: count > 0 ? (total / count).toFixed(2) : 0,
      attempts: count,
    }));
  };

  const analytics = calculateAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Admin Dashboard</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Manage Users</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Manage Quizzes</h3>
          <form onSubmit={handleQuizSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Quiz Title</label>
              <input
                type="text"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Topic ID</label>
              <input
                type="text"
                value={newQuiz.topic}
                onChange={(e) => setNewQuiz({ ...newQuiz, topic: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Question IDs (comma-separated)</label>
              <input
                type="text"
                value={newQuiz.questions.join(',')}
                onChange={(e) => setNewQuiz({ ...newQuiz, questions: e.target.value.split(',').map((id) => id.trim()) })}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., 123,456,789"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Available From</label>
              <input
                type="datetime-local"
                value={newQuiz.availableFrom}
                onChange={(e) => setNewQuiz({ ...newQuiz, availableFrom: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Available Until</label>
              <input
                type="datetime-local"
                value={newQuiz.availableUntil}
                onChange={(e) => setNewQuiz({ ...newQuiz, availableUntil: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Create Quiz
            </Button>
          </form>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Topic</th>
                <th className="p-2 border">Questions</th>
                <th className="p-2 border">Time Limit</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{quiz.title}</td>
                  <td className="p-2 border">{quiz.topic?.name || 'N/A'}</td>
                  <td className="p-2 border">{quiz.questions.length}</td>
                  <td className="p-2 border">{quiz.timeLimit} min</td>
                  <td className="p-2 border">{quiz.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="p-2 border">
                    <Button
                      onClick={() => handleQuizUpdate(quiz._id, { ...quiz, title: quiz.title + ' (Updated)' })}
                      className="bg-yellow-600 hover:bg-yellow-700 mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleQuizDelete(quiz._id)}
                      className="bg-red-600 hover:bg-red-700 mr-2"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleQuizAvailability(quiz._id, { isActive: !quiz.isActive })}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {quiz.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Quiz Results & Analytics</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Quiz</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{result.user?.name || 'N/A'}</td>
                  <td className="p-2 border">{result.quiz?.title || 'N/A'}</td>
                  <td className="p-2 border">{result.score}</td>
                  <td className="p-2 border">{new Date(result.completedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Analytics</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Quiz</th>
                <th className="p-2 border">Average Score</th>
                <th className="p-2 border">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((analytic) => {
                const quiz = quizzes.find((q) => q._id === analytic.quizId);
                return (
                  <tr key={analytic.quizId} className="hover:bg-gray-50">
                    <td className="p-2 border">{quiz?.title || 'N/A'}</td>
                    <td className="p-2 border">{analytic.averageScore}</td>
                    <td className="p-2 border">{analytic.attempts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 mt-6"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;