'use client';
import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

interface HeaderProps {
  onSearch: (query: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">KitchenWise</h1>
            <form onSubmit={handleSearch} className="max-w-md flex gap-2">
              <Input
                type="search"
                placeholder="Search ingredients or recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[300px]"
              />
              <Button type="submit">
                Search
              </Button>
            </form>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;