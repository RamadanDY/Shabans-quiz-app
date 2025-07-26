import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, topicPerformance: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Dashboard stats response:', response.data);
        setStats(response.data.data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError('Failed to load dashboard stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">Loading dashboard...</p></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-6 text-center">Your Quiz Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Quiz Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Total Quizzes Taken: {stats.totalQuizzes}</p>
              <p className="text-lg font-semibold mt-2">Average Score: {stats.averageScore}%</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                onClick={() => navigate('/topics')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                aria-label="Start New Quiz"
              >
                Start New Quiz
              </Button>
              <Button
                onClick={() => navigate('/results')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                aria-label="View Past Results"
                disabled={stats.totalQuizzes === 0}
              >
                View Past Results
              </Button>
            </CardContent>
          </Card>
        </div>
        {stats.topicPerformance.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle>Topic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Quizzes Taken</TableHead>
                    <TableHead>Average Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topicPerformance.map((topic, index) => (
                    <TableRow key={index}>
                      <TableCell>{topic.topic}</TableCell>
                      <TableCell>{topic.quizzesTaken}</TableCell>
                      <TableCell>{topic.averageScore}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;