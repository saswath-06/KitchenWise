'use client';
import React from 'react';
import { Recipe } from '../types';
import Button from './ui/Button';

interface RecipeDetailProps {
  recipe: Recipe;
  onCook: () => void;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onCook,
  onClose,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <div className="flex gap-4 text-gray-600">
          <div>
            <span className="font-medium">Prep Time:</span> {recipe.cookingTime.prep}min
          </div>
          <div>
            <span className="font-medium">Cook Time:</span> {recipe.cookingTime.cook}min
          </div>
          <div>
            <span className="font-medium">Servings:</span> {recipe.servings}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="font-bold text-blue-600 w-6">
                    {idx + 1}.
                  </span>
                  <span>{instruction.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-gray-600">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Calories:</span>
                <span>{recipe.macros.calories}kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Protein:</span>
                <span>{recipe.macros.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs:</span>
                <span>{recipe.macros.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span>Fat:</span>
                <span>{recipe.macros.fat}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onCook}>
          Cook This Recipe
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetail;