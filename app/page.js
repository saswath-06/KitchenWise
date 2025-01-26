'use client';

import { useState } from 'react';

export default function Home() {
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');

  const fetchIngredients = async () => {
    try {
      const token = 'harry'; // Replace with your actual token
      const response = await fetch('http://localhost:5000/api/ingredients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIngredients(data);
    } catch (err) {
      console.error('Error connecting to backend:', err);
      setIngredients([]);
      setError('Failed to fetch ingredients. Please check the server or API.');
    }
  };  

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>KitchenWise: Fetch Ingredients</h1>
      <p>Click the button below to fetch ingredients from the backend.</p>
      <button
        onClick={fetchIngredients}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Fetch Ingredients
      </button>
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {ingredients.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {ingredients.map((ingredient, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {ingredient.name} - {ingredient.quantity}
              </li>
            ))}
          </ul>
        ) : (
          !error && <p>No ingredients found.</p>
        )}
      </div>
    </div>
  );
}
