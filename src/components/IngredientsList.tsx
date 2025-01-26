'use client';
import React, { useState, useEffect } from 'react';
import { Ingredient } from '../types';
import apiService from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import AddIngredientForm from './AddIngredientForm';
import Modal from './ui/Modal';

const IngredientsList: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getIngredients();
      setIngredients(data);
    } catch (err) {
      setError('Failed to load ingredients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteIngredient(id);
      setIngredients(prev => prev.filter(ing => ing._id !== id));
    } catch (err) {
      setError('Failed to delete ingredient');
    }
  };

  const handleAddSuccess = (newIngredient: Ingredient) => {
    setIngredients(prev => [...prev, newIngredient]);
    setIsAddModalOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading ingredients...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Ingredients</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add Ingredient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map((ingredient) => (
          <Card key={ingredient._id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{ingredient.name}</h3>
                <p className="text-gray-600">
                  {ingredient.quantity} {ingredient.unit}
                </p>
                <p className="text-sm text-gray-500">
                  Added: {new Date(ingredient.dateAdded).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(ingredient._id)}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Ingredient"
      >
        <AddIngredientForm onSuccess={handleAddSuccess} />
      </Modal>

      {ingredients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No ingredients added yet. Start by adding some ingredients!
        </div>
      )}
    </div>
  );
};

export default IngredientsList;