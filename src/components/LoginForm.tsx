'use client';
import React, { useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';

export default function LoginForm() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded">
          {error}
        </div>
      )}
      
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <Button type="submit" disabled={loading} isLoading={loading}>
        {isRegister ? 'Register' : 'Login'}
      </Button>

      <button
        type="button"
        onClick={() => setIsRegister(!isRegister)}
        className="text-blue-500 hover:text-blue-700 text-sm w-full"
      >
        {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </form>
  );
}