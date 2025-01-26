import React from 'react';

const RecipeCard = ({ recipe, onCheck }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} />
      <h2>{recipe.name}</h2>
      <p>Cuisine: {recipe.cuisine}</p>
      <p>Calories: {recipe.calories}</p>
      <p>Protein: {recipe.protein}g</p>
      <p>Fat: {recipe.fat}g</p>
      <button onClick={() => onCheck(recipe.id)}>Check</button>
    </div>
  );
};

export default RecipeCard;
