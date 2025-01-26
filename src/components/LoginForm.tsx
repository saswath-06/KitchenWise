'use client';
import React, { useState } from 'react';
import apiService from '../services/api';

interface LoginFormProps {
  onLogin: () => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        const response = await apiService.register(
          formData.email,
          formData.password,
          formData.name
        );
        localStorage.setItem('token', response.token);
      } else {
        const response = await apiService.login(formData.email, formData.password);
        localStorage.setItem('token', response.token);
      }
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? 'Create Account' : 'Login'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                className="input-field"
                value={formData.name}
                onChange={handleInputChange}
                required={isRegister}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 hover:text-blue-800 text-center w-full"
          disabled={isLoading}
        >
          {isRegister
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;