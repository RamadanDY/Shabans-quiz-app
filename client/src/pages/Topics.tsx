 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Topics = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data.data);
      } catch (err) {
        setError('Failed to load topics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleStartQuiz = () => {
    if (selectedTopic) {
      navigate('/questions', { state: { topic: selectedTopic } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl text-gray-300 font-math">π</div>
        <div className="absolute bottom-20 right-20 text-5xl text-gray-300 font-math">Σ</div>
        <div className="absolute top-1/3 left-1/4 text-4xl text-gray-300 font-math">∞</div>
        <div className="absolute bottom-1/3 right-1/4 text-5xl text-gray-300 font-math">∫</div>
      </div>

      <div className="max-w-4xl w-full z-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center animate-fade-in">
          Choose a Maths Topic
        </h1>
        {loading && <p className="text-center text-gray-600">Loading topics...</p>}
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}
        {!loading && !error && topics.length === 0 && (
          <p className="text-center text-gray-600">No topics available.</p>
        )}
        {!loading && !error && topics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card
                key={topic._id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedTopic === topic.name ? 'border-blue-600 border-2' : ''
                }`}
                onClick={() => handleTopicSelect(topic.name)}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-700">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Button
            onClick={handleStartQuiz}
            className="bg-blue-600 text-white px-8 py-3 text-lg rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            disabled={!selectedTopic || loading}
          >
            Start Quiz
          </Button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');
        .font-math {
          font-family: 'Roboto Slab', serif;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Topics;