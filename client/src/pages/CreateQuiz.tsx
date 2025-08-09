 import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: '',
    topic: { name: '', description: '' },
    topicId: '',
    questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    timeLimit: '',
    isActive: true,
    availableFrom: '',
    availableUntil: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill topic details if passed from CreateTopicForm
  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        topic: {
          name: location.state.topicName || '',
          description: location.state.topicDescription || '',
        },
        topicId: location.state.topicId || '',
      }));
    }
  }, [location.state]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('questionText') || name.startsWith('option') || name.startsWith('correctAnswer')) {
      const updatedQuestions = [...formData.questions];
      if (name.startsWith('questionText')) {
        updatedQuestions[index].questionText = value;
      } else if (name.startsWith('option')) {
        const optionIndex = parseInt(name.split('-')[1]);
        updatedQuestions[index].options[optionIndex] = value;
      } else if (name.startsWith('correctAnswer')) {
        updatedQuestions[index].correctAnswer = value;
      }
      setFormData({ ...formData, questions: updatedQuestions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setMessage('');
    setError('');
  };

  const handleTopicChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, topic: { ...formData.topic, [name]: value } });
    setMessage('');
    setError('');
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: updatedQuestions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Quiz title is required');
      return;
    }
    if (!formData.topic.name.trim() && !formData.topicId) {
      setError('Topic name or ID is required');
      return;
    }
    if (formData.questions.length === 0) {
      setError('At least one question is required');
      return;
    }
    if (!formData.timeLimit || formData.timeLimit < 1) {
      setError('Time limit must be at least 1 minute');
      return;
    }
    const validQuestions = formData.questions.every(
      (q) => q.questionText && q.options.length === 4 && q.options.every((opt) => opt) && q.options.includes(q.correctAnswer)
    );
    if (!validQuestions) {
      setError('Each question must have text, 4 options, and a correct answer from the options');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/quiz/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Quiz created successfully!');
        setFormData({
          title: '',
          topic: { name: '', description: '' },
          topicId: '',
          questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
          timeLimit: '',
          isActive: true,
          availableFrom: '',
          availableUntil: '',
        });
        setTimeout(() => {
          navigate('/quizzes'); // Adjust redirect path as needed
        }, 1000);
      } else {
        setError(result.message || 'Failed to create quiz');
      }
    } catch (err) {
      setError('An error occurred while creating the quiz. Please check your network connection.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Quiz Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., General Knowledge Quiz"
            required
          />
        </div>
        <div>
          <label htmlFor="topicName" className="block text-sm font-medium text-gray-700">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="topicName"
            value={formData.topic.name}
            onChange={handleTopicChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., General Knowledge"
            required
          />
        </div>
        <div>
          <label htmlFor="topicDescription" className="block text-sm font-medium text-gray-700">
            Topic Description
          </label>
          <textarea
            name="description"
            id="topicDescription"
            value={formData.topic.description}
            onChange={handleTopicChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., A collection of trivia questions"
            rows={4}
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="topicId" className="block text-sm font-medium text-gray-700">
            Topic ID (Optional)
          </label>
          <input
            type="text"
            name="topicId"
            id="topicId"
            value={formData.topicId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 60d21b4667d0d8992e610c86"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Questions</label>
          {formData.questions.map((question, index) => (
            <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label htmlFor={`questionText-${index}`} className="block text-sm font-medium text-gray-700">
                  Question {index + 1} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name={`questionText-${index}`}
                  id={`questionText-${index}`}
                  value={question.questionText}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., What is the capital of France?"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Options <span className="text-red-500">*</span></label>
                {question.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    name={`option-${optIndex}`}
                    value={option}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={`Option ${optIndex + 1}`}
                    required
                  />
                ))}
              </div>
              <div className="mt-2">
                <label htmlFor={`correctAnswer-${index}`} className="block text-sm font-medium text-gray-700">
                  Correct Answer <span className="text-red-500">*</span>
                </label>
                <select
                  name={`correctAnswer-${index}`}
                  id={`correctAnswer-${index}`}
                  value={question.correctAnswer}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Correct Answer</option>
                  {question.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option || `Option ${optIndex + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Add Another Question
          </button>
        </div>
        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
            Time Limit (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="timeLimit"
            id="timeLimit"
            value={formData.timeLimit}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 30"
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
            Active Status
          </label>
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">
            Available From
          </label>
          <input
            type="datetime-local"
            name="availableFrom"
            id="availableFrom"
            value={formData.availableFrom}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="availableUntil" className="block text-sm font-medium text-gray-700">
            Available Until
          </label>
          <input
            type="datetime-local"
            name="availableUntil"
            id="availableUntil"
            value={formData.availableUntil}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;