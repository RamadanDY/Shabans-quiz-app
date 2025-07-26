 import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, questions, selectedAnswers, topic } = location.state || {};

  if (!questions || !selectedAnswers || score === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No quiz results available.</AlertDescription>
        </Alert>
        <Button
          onClick={() => navigate('/topics')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
          aria-label="Back to Topics"
        >
          Back to Topics
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-6 text-center">
          Quiz Results - {topic}
        </h1>
        <Alert
          className={`max-w-md mx-auto mb-8 shadow-md ${
            score >= questions.length / 2 ? 'bg-green-50' : 'bg-yellow-50'
          }`}
        >
          <AlertTitle className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-blue-600" />
            Your Score
          </AlertTitle>
          <AlertDescription className="text-lg">
            {score}/{questions.length} ({((score / questions.length) * 100).toFixed(2)}%)

           </AlertDescription>
        </Alert>
        <Card className="w-full bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Question Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index] || 'Not answered';
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-semibold text-gray-700">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-800">{question.questionText}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant={isCorrect ? 'success' : 'destructive'}
                          className={`${
                            isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          } flex items-center gap-1`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Your Answer: {userAnswer}
                        </Badge>
                      </div>
                      {!isCorrect && (
                        <p className="mt-1 text-md text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Correct Answer: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < questions.length - 1 && <Separator className="my-4" />}
                </div>
              );
            })}
            <div className="mt-8 text-center">
              <Button
                onClick={() => navigate('/topics')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md"
                aria-label="Back to Topics"
              >
                Back to Topics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;