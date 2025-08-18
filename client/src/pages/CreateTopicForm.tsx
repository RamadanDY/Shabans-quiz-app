import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token'); // from login
if (!token) {
  console.error('No token found in localStorage');
}
const CreateTopicForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    createdBy: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Topic name is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/topics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // ✅ Send token
  },
  body: JSON.stringify(formData),
});

      const result = await response.json();
      console.log("Navigating with:", result);

      if (response.ok) {
  setMessage('Topic created successfully!');
  setFormData({ name: '', description: '', createdBy: '' });

  navigate('/CreateQuiz', {
    state: {
      topicId: result._id,  // ✅ direct access
      topicName: result.name,
      topicDescription: result.description
    }
  });
       } else {
        console.error('Error creating  topics:', {
          message: result.message,
          status: response.status,
          data: result
        });
        setError(result.message || 'Failed to create topic');
      }
    } catch (err) {
      console.error('Error creating topic:', {
        message: err.message,
        request: err.request ? 'No response received from server' : null
      });
      setError('An error occurred while creating the topic. Please check your network connection.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Topic</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., General Knowledge"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., A collection of trivia questions"
            rows={4}
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">
            Created By (User ID, optional)
          </label>
          <input
            type="text"
            name="createdBy"
            id="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 60d21b4667d0d8992e610c86"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Topic
        </button>
      </form>
    </div>
  );
};

export default CreateTopicForm;