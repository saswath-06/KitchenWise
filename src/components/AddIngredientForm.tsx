'use client';
import React, { useState } from 'react';
import { Ingredient } from '@/src/types';
import apiService from '@/src/services/api';
import Input from './ui/Input';
import Button from './ui/Button';

interface AddIngredientFormProps {
  onSuccess: (ingredient: Ingredient) => void;
}

const AddIngredientForm: React.FC<AddIngredientFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }

      const ingredient = await apiService.addIngredient({
        name: formData.name,
        quantity,
        unit: formData.unit,
        source: 'manual'
      });

      onSuccess(ingredient);
      setFormData({ name: '', quantity: '', unit: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ingredient');
    } finally {
      setIsLoading(false);
    }
  };

  const commonUnits = ['pieces', 'grams', 'kg', 'ml', 'liters', 'cups', 'tbsp', 'tsp'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <Input
          label="Ingredient Name"
          placeholder="e.g., Tomatoes"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Quantity"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 500"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select unit</option>
            {commonUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Add Ingredient
        </Button>
      </div>
    </form>
  );
};

export default AddIngredientForm;