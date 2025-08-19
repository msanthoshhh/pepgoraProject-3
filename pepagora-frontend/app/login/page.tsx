'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import { saveToken } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { accessToken, user } = res.data.data;
      saveToken(accessToken, user.id, user.role);
      localStorage.setItem('accessToken', accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-[#fff] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#fff] p-8 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          {/* <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C9.8 0 7.6 1 6 2.6l2.8 2.8C9.7 4.4 10.8 4 12 4s2.3.4 3.2 1.4l2.8-2.8C16.4 1 14.2 0 12 0zM6 21.4l2.8-2.8C9.7 19.6 10.8 20 12 20s2.3-.4 3.2-1.4l2.8 2.8C16.4 23 14.2 24 12 24s-3.6-1-6-2.6z" />
          </svg> */}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black text-center mb-2">Sign in to your account</h2>
       

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-black-300 mb-1">Email address</label>
            <input
              type="email" 
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-100 text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm text-black-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-100 text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div> */}

          <div>
  <label className="block text-sm text-black-300 mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-gray-100 text-black border border-gray-600 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
    <button
      type="button"
      onMouseDown={() => setShowPassword(true)}
      onMouseUp={() => setShowPassword(false)}
      onMouseLeave={() => setShowPassword(false)}
      className="absolute inset-y-0 right-3 flex items-center"
      tabIndex={-1}
    >
      {showPassword ? (
        // 👁️ Open eye
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 
            8.268 2.943 9.542 7-1.274 4.057-5.064 
            7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        // 🙈 Crossed eye
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 
            19c-4.478 0-8.268-2.943-9.542-7a10.059 
            10.059 0 012.108-3.308M6.872 6.872A9.957 
            9.957 0 0112 5c4.478 0 8.268 2.943 
            9.542 7a9.97 9.97 0 01-4.13 5.258M15 
            12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
        </svg>
      )}
    </button>
  </div>
</div>


          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}


          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#e02c24] hover:bg-[#aa0900] text-white font-semibold py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        {/* <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="px-2 text-sm text-gray-400">Or continue with</span>
          <hr className="flex-grow border-gray-600" />
        </div> */}

        {/* OAuth buttons */}
        {/* <div className="flex space-x-4"> */}
          {/* <button className="flex items-center justify-center w-1/2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
            Google
          </button>
          <button className="flex items-center justify-center w-1/2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5 mr-2 fill-white" viewBox="0 0 24 24">
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4a3.1 3.1 0 0 0-1.3-1.7c-1.1-.8 0-.8 0-.8a2.5 2.5 0 0 1 1.8 1.2 2.5 2.5 0 0 0 3.4 1 2.5 2.5 0 0 1 .7-1.6C6.5 18 4 17 4 12.4a4.8 4.8 0 0 1 1.3-3.3 4.4 4.4 0 0 1 .1-3.3s1-.3 3.4 1.3a11.7 11.7 0 0 1 6.2 0C17.2 5.4 18 5.8 18 5.8a4.4 4.4 0 0 1 .1 3.3A4.8 4.8 0 0 1 20 12.4c0 4.6-2.5 5.6-4.9 5.9a2.8 2.8 0 0 1 .8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
            </svg>
            GitHub
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
}
