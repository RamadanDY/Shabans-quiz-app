import { useState, useEffect } from 'react';
import axios from 'axios';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/quiz/questions', {
        params: { difficulty: difficulty || undefined, limit: 10 },
      });
      setQuestions(response.data.data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setFeedback(null);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [difficulty]);

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      setFeedback({ isCorrect: false, message: 'Please select an answer.' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/quiz/submit', {
        questionId: questions[currentQuestionIndex]._id,
        selectedAnswer,
      });
      setFeedback({
        isCorrect: response.data.data.isCorrect,
        message: response.data.data.isCorrect
          ? 'Correct!'
          : `Incorrect. The correct answer is: ${response.data.data.correctAnswer}`,
      });
    } catch (err) {
      setFeedback({ isCorrect: false, message: 'Error submitting answer.' });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setFeedback(null);
    } else {
      fetchQuestions(); // Reload questions when reaching the end
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Maths Quiz</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Select Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {loading && <p className="text-center text-gray-600">Loading questions...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {questions.length > 0 && !loading && !error && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}: {currentQuestion.questionText}
          </h2>
          <p className="text-gray-600 mb-4">Difficulty: {currentQuestion.difficulty}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`p-4 mb-4 rounded-md ${
            feedback.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !questions.length}
        >
          Submit Answer
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          disabled={loading || !questions.length}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default QuizApp;