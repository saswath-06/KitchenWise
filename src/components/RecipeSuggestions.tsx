'use client';
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import apiService from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import RecipeCard from './RecipeCard';
import Modal from './ui/Modal';
import RecipeDetail from './RecipeDetail';

const cuisineOptions = [
  'All',
  'Italian',
  'Chinese',
  'Mexican',
  'Indian',
  'Japanese',
  'Mediterranean',
  'American',
];

const RecipeSuggestions: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [selectedCuisine]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getSuggestedRecipes(
        selectedCuisine === 'All' ? undefined : selectedCuisine
      );
      setRecipes(response);
    } catch (err) {
      setError('Failed to fetch recipe suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookRecipe = async (recipe: Recipe) => {
    try {
      await apiService.markRecipeAsCooked(recipe._id);
      setSelectedRecipe(null);
      // Refresh recipes to update available ingredients
      fetchRecipes();
    } catch (err) {
      setError('Failed to mark recipe as cooked');
    }
  };

  const handleFavoriteToggle = async (recipe: Recipe) => {
    try {
      const updatedRecipe = await apiService.toggleFavoriteRecipe(recipe._id);
      setRecipes(prev =>
        prev.map(r => (r._id === recipe._id ? updatedRecipe : r))
      );
    } catch (err) {
      setError('Failed to update favorite status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Recipe Suggestions</h2>
        <div className="flex gap-2 flex-wrap">
          {cuisineOptions.map((cuisine) => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading recipes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onSelect={() => setSelectedRecipe(recipe)}
              onFavoriteToggle={() => handleFavoriteToggle(recipe)}
            />
          ))}
        </div>
      )}

      {recipes.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No recipes available for the selected cuisine.
          Try adding more ingredients or selecting a different cuisine!
        </div>
      )}

      <Modal
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        maxWidth="lg"
      >
        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onCook={() => handleCookRecipe(selectedRecipe)}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default RecipeSuggestions;