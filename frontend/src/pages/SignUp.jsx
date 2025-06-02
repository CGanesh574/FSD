import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="p-6 max-w-lg w-full bg-white rounded-xl shadow-lg border border-[#1a237e]/20">
        <h1 className="text-3xl text-center font-semibold my-7 text-[#1a237e]">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            id="username"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="email"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-[#1a237e] text-white p-3 rounded-lg uppercase hover:bg-[#283593] disabled:opacity-80 transition-all shadow-md"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className="text-[#1a237e] font-semibold hover:underline">Sign In</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
