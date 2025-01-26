'use client';
import React from 'react';
import { Recipe } from '../types';
import Card from './ui/Card';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
  onFavoriteToggle: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onFavoriteToggle,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle();
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={onSelect}
    >
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
      >
        <svg
          className={`w-6 h-6 ${recipe.isFavorite ? 'text-red-500 fill-current' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold pr-8">{recipe.title}</h3>
        
        <div className="flex gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Prep:</span>{' '}
            {recipe.cookingTime.prep}min
          </div>
          <div>
            <span className="font-medium">Cook:</span>{' '}
            {recipe.cookingTime.cook}min
          </div>
          <div>
            <span className="font-medium">Serves:</span> {recipe.servings}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Ingredients:</div>
          <div className="text-gray-600 text-sm">
            {recipe.ingredients.slice(0, 3).map((ing, idx) => (
              <div key={idx}>
                • {ing.name} ({ing.quantity} {ing.unit})
              </div>
            ))}
            {recipe.ingredients.length > 3 && (
              <div className="text-blue-600">
                +{recipe.ingredients.length - 3} more...
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <span className={`
            px-2 py-1 rounded-full text-xs
            ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}
          `}>
            {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
          </span>
          {recipe.cuisine && (
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {recipe.cuisine}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;