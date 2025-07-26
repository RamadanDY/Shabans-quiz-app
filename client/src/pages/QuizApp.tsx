 import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuizApp = () => {
  const location = useLocation();
  const { topic } = location.state || {};
  console.log('Received topic:', topic);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!topic) {
      setError('No topic selected. Please choose a topic.');
      setLoading(false);
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/questions', {
          params: { topic, limit: 10 },
        });
        console.log('API response:', response.data);
        setQuestions(response.data.data);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topic]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz finished! Your score: ${score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0)}/${questions.length}`);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!questions.length) return <p className="text-center text-gray-600">No questions available for this topic.</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Maths Quiz - {topic}</h1>
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">{currentQuestion.questionText}</p>
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? 'default' : 'outline'}
                onClick={() => handleAnswerSelect(option)}
                className="text-left justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="bg-blue-600 text-white px-6 py-2"
            >
              Submit Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizApp;