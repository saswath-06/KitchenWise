import React, { useState } from 'react';

const IngredientForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, quantity });
    setName('');
    setQuantity(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Ingredient Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button type="submit">Add Ingredient</button>
    </form>
  );
};

export default IngredientForm;
