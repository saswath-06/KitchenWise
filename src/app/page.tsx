'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import IngredientsList from '../components/IngredientsList';
import ReceiptUpload from '../components/ReceiptUpload';
import RecipeSuggestions from '../components/RecipeSuggestions';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <IngredientsList />
            <ReceiptUpload />
          </div>
          
          <div>
            <RecipeSuggestions />
          </div>
        </div>
      </main>
    </div>
  );
}