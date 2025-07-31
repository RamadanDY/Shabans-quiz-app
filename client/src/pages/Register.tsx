 import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Role state updated:', role);
  }, [role]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    console.log('Role selected:', selectedRole);
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    console.log('Form submitted with:', { name, email, password, role });

    if (!role) {
      console.error('Role is undefined before submission');
      setError('Please select a role');
      return;
    }

    try {
      const result = await register(name, email, password, role);
      console.log('Register result:', result);
      if (result.success) {
        console.log('Register success:', result.user);
        navigate(result.user.role === 'admin' ? '/admin' : '/questions');
      } else {
        setError(result.message);
        console.error('Register failed:', result.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Register for Maths Quiz
        </h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Register
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
