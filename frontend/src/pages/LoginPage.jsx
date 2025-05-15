import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, isSigningIn } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.log('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 z-10 bg-base-100 rounded-lg m-4 shadow-xl">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-full shadow-lg">
              <svg className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-base-content">Login to Your Account</h2>
            <p className="mt-2 text-base-content-60">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-base-content">Email</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content-60" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-primary focus:border-primary bg-base-100 text-base-content"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-base-content">Password</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content-60" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-base-content/20 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-primary focus:border-primary bg-base-100 text-base-content"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5 text-base-content-60" /> : 
                    <Eye className="h-5 w-5 text-base-content-60" />
                  }
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-primary hover:bg-primary-focus transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isSigningIn ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-base-content-60">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-focus">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Optional illustration */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-r from-primary to-primary-focus">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">Connect with friends and family</h2>
          <p className="text-xl">Stay connected with your loved ones through our modern messaging platform.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
