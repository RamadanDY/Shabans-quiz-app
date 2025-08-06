import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateQuizForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicId, topicName, topicDescription } = location.state || {};

  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options = [...updatedQuestions[index].options];
      updatedQuestions[index].options[value.optionIndex] = value.optionValue;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
    setError('');
    setMessage('');
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!title.trim()) {
      setError('Quiz title is required');
      return;
    }
    if (!timeLimit || parseInt(timeLimit) < 1) {
      setError('Time limit must be at least 1 minute');
      return;
    }
    if (!topicId) {
      setError('Topic ID is required');
      return;
    }
    if (questions.length === 0) {
      setError('At least one question is required');
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.some(opt => !opt.trim()) || q.options.length !== 4) {
        setError(`Question ${i + 1} must have exactly 4 non-empty options`);
        return;
      }
      if (!q.correctAnswer.trim() || !q.options.includes(q.correctAnswer)) {
        setError(`Question ${i + 1} correct answer must be one of the options`);
        return;
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/api/quiz', {
        title,
        topic: topicId,
        timeLimit: parseInt(timeLimit),
        availableFrom: availableFrom || null,
        availableUntil: availableUntil || null,
        isActive: true,
        questions
      });

      setMessage('Quiz created successfully!');
      setTitle('');
      setTimeLimit('');
      setAvailableFrom('');
      setAvailableUntil('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
      setTimeout(() => navigate('/quizzes'), 1000);
    } catch (error) {
      console.error('Error creating quiz:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : null,
        request: error.request ? 'No response received from server' : null
      });

      let errorMessage = 'Error creating quiz. Please try again.';
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage = data.message || 'Invalid quiz data. Please check your inputs.';
        } else if (status === 404) {
          errorMessage = data.message || 'Topic not found. Please select a valid topic.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || `Unexpected error (status: ${status}).`;
        }
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your network connection.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Quiz for Topic</h2>
      <p className="mb-2"><strong>Topic:</strong> {topicName || 'Not selected'}</p>
      <p className="mb-6 text-gray-600">{topicDescription || 'No description'}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Quiz Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., JavaScript Basics Quiz"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Time Limit (in minutes) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 15"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Available From</label>
            <input
              type="datetime-local"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Available Until</label>
            <input
              type="datetime-local"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="border p-4 mb-4 rounded-md shadow-sm">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Question {index + 1} <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                className="w-full border px-3 py-2 mb-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., What does `typeof null` return in JavaScript?"
              />

              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(index, 'options', { optionIndex, optionValue: e.target.value })}
                    className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
              </div>

              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                className="w-full border px-3 py-2 mt-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Correct Answer (must match one option)"
              />

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 mt-2 hover:underline text-sm"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Question
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-3 rounded-md font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuizForm;