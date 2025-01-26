'use client';
import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import Header from '@/src/components/Header';
import LoginForm from '@/src/components/LoginForm';
import IngredientsList from '@/src/components/IngredientsList';
import ReceiptUpload from '@/src/components/ReceiptUpload';
import RecipeSuggestions from '@/src/components/RecipeSuggestions';
import Card from '@/src/components/ui/Card';
import Loading from '@/src/components/ui/Loading';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Ingredients</h2>
                <IngredientsList />
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
                <ReceiptUpload />
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recipe Suggestions</h2>
                <RecipeSuggestions />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}