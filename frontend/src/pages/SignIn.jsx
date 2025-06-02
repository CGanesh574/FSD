import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="p-6 max-w-lg w-full bg-white rounded-xl shadow-lg border border-[#1a237e]/20">
        <h1 className="text-3xl text-center font-semibold my-7 text-[#1a237e]">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p>Don't have an account?</p>
          <Link to={'/sign-up'}>
            <span className="text-[#1a237e] font-semibold hover:underline">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
