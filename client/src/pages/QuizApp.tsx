import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type Question = {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  [key: string]: any;
};

const QuizApp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // pick topic from (1) navigation state, (2) query string, (3) persisted localStorage
  const stateTopic = (location.state as any)?.topic as string | undefined;
  const params = new URLSearchParams(location.search);
  const queryTopic = params.get('topic') ?? undefined;
  const persistedTopic = localStorage.getItem('selectedTopic') ?? undefined;
  const topic = stateTopic || queryTopic || persistedTopic;

  // persist topic so page-refresh still works
  useEffect(() => {
    if (topic) localStorage.setItem('selectedTopic', topic);
  }, [topic]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

 useEffect(() => {
  const fetchQuestions = async () => {
    if (!topic) {
      setError('No topic selected. Please choose a topic.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:5000/api/quiz/quizzes/topic/${topic}`, {
        params: { limit: 10 }, // Note: `limit` may not be used in the backend yet
      });

      // Backend returns an array of quizzes, each with a questions array
      const quizzes = response.data;
      if (!Array.isArray(quizzes) || quizzes.length === 0) {
        setQuestions([]);
        setError('No quizzes found for this topic.');
        return;
      }

      // Flatten questions from all quizzes
      const allQuestions = quizzes.flatMap(quiz => quiz.questions);
      if (allQuestions.length === 0) {
        setQuestions([]);
        setError('No questions found for this topic.');
      } else {
        setQuestions(allQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to load questions.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  fetchQuestions();
}, [topic]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleSubmitAllAnswers = async () => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) finalScore += 1;
    });

    setScore(finalScore);

    try {
      await axios.post(
        'http://localhost:5000/api/quiz/results',
        {
          topic,
          score: finalScore,
          totalQuestions: questions.length,
          selectedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Quiz result saved successfully');
    } catch (err) {
      console.error('Error saving quiz result:', err);
    } finally {
      navigate('/results', { state: { score: finalScore, questions, selectedAnswers, topic } });
    }
  };

  const handleNextQuestion = () => setCurrentQuestionIndex((i) => Math.min(i + 1, questions.length - 1));
  const handlePreviousQuestion = () => setCurrentQuestionIndex((i) => Math.max(i - 1, 0));

  if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!questions.length) return <p className="text-center text-gray-600">No questions available for this topic.</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentSelectedAnswer = selectedAnswers[currentQuestionIndex] ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Maths Quiz - {topic}</h1>

      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-lg mb-4">{currentQuestion.questionText}</p>

          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options?.map((option, idx) => (
              <Button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`text-left justify-start w-full ${currentSelectedAnswer === option ? 'bg-blue-600 text-white' : ''}`}
              >
                {option}
              </Button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-600 text-white px-4 py-2 disabled:opacity-50"
            >
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitAllAnswers}
                disabled={!currentSelectedAnswer}
                className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
              >
                Submit All Answers
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-gray-600 text-white px-4 py-2 disabled:opacity-50"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizApp;
