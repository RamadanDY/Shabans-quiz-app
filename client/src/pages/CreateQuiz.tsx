

 import React, { useState } from 'react';
import axios from 'axios';

const CreateQuiz = () => {
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [timeLimit, setTimeLimit] = useState('');
  const [message, setMessage] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  const handleQuestionTextChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // 👈 make sure you stored this at login

  try {
    const quizPayload = {
      title,
      topic: {
        name: topicName,
        description: topicDescription,
      },
      questions,
      timeLimit,
      isActive: true,
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: userId, // ✅ include this line
    };

    await axios.post('http://localhost:5000/api/quiz/quizzes', quizPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMessage('✅ Quiz successfully created!');
    setTitle('');
    setTopicName('');
    setTopicDescription('');
    setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    setTimeLimit('');
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Unknown error occurred';

    setMessage(`❌ Failed to create quiz: ${errorMessage}`);
  }
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Quiz</h2>

      {message && (
        <p
          className={`mb-4 p-3 rounded ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Enter topic name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic Description</label>
              <textarea
          value={topicDescription}
          onChange={(e) => setTopicDescription(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
          placeholder="Enter topic description"
        />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Enter time limit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
          {questions.map((q, index) => (
            <div key={index} className="mb-4 border p-3 rounded-md bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question {index + 1}</label>
              <input
                type="text"
                value={q.questionText}
                onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                required
                className="w-full p-2 border rounded-md mb-2"
                placeholder="Enter question text"
              />

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                    required
                    className="p-2 border rounded-md"
                    placeholder={`Option ${optIndex + 1}`}
                  />
                ))}
              </div>

              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                required
                className="w-full p-2 border rounded-md mt-2"
                placeholder="Correct Answer"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Add Question
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
