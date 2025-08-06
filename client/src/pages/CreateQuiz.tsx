import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateQuiz = () => {
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

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options = [...updatedQuestions[index].options];
      updatedQuestions[index].options[value.optionIndex] = value.optionValue;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
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
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!title.trim()) {
      alert('Quiz title is required');
      return;
    }
    if (!timeLimit || parseInt(timeLimit) < 1) {
      alert('Time limit must be at least 1 minute');
      return;
    }
    if (!topicId) {
      alert('Topic ID is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/question', {
        title,
         topic: topicId,topicName, // Send only topicId, not the full topic object
        timeLimit: parseInt(timeLimit), // Ensure number type
        availableFrom: availableFrom || null,
        availableUntil: availableUntil || null,
        isActive: true,
        questions
      });

      alert('Quiz created successfully!');
      navigate('/quizzes');
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
          errorMessage = data.message || 'Topic not found. Please select a valid topic.❌ ';
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

      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Quiz for Topic</h2>
      <p className="mb-2"><strong>Topic:</strong> {topicName}</p>
      <p className="mb-6 text-gray-600">{topicDescription}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Quiz Title</label>
          <input type="text" className="w-full border px-3 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block font-semibold mb-1">Time Limit (in minutes)</label>
          <input type="number" className="w-full border px-3 py-2 rounded" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} required />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Available From</label>
            <input type="datetime-local" className="w-full border px-3 py-2 rounded" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Available Until</label>
            <input type="datetime-local" className="w-full border px-3 py-2 rounded" value={availableUntil} onChange={(e) => setAvailableUntil(e.target.value)} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <label className="block font-semibold mb-1">Question {index + 1}</label>
              <input
                type="text"
                className="w-full border px-3 py-2 mb-2 rounded"
                placeholder="Enter question text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    className="border px-3 py-2 rounded"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleQuestionChange(index, 'options', { optionIndex, optionValue: e.target.value })}
                  />
                ))}
              </div>

              <input
                type="text"
                className="w-full border px-3 py-2 mt-2 rounded"
                placeholder="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              />

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 mt-2 hover:underline"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700">
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;