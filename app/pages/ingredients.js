import { useState } from 'react';
import { fetchAPI } from '../utils/api';

export default function Ingredients() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);

  async function handleAddIngredient(e) {
    e.preventDefault();
    try {
      const response = await fetchAPI('/ingredients', {
        method: 'POST',
        body: JSON.stringify({ name, quantity }),
      });
      alert('Ingredient added successfully!');
      console.log(response);
    } catch (err) {
      console.error(err);
      alert('Failed to add ingredient.');
    }
  }

  return (
    <div>
      <h1>Manage Ingredients</h1>
      <form onSubmit={handleAddIngredient}>
        <input type="text" placeholder="Ingredient Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button type="submit">Add Ingredient</button>
      </form>
    </div>
  );
}
