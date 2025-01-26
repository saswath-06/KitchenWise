import React from 'react';

const RecipeFilter = ({ cuisines, selectedCuisine, onFilter }) => {
  return (
    <div className="recipe-filter">
      <label htmlFor="cuisine">Filter by Cuisine:</label>
      <select id="cuisine" value={selectedCuisine} onChange={(e) => onFilter(e.target.value)}>
        <option value="">All</option>
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RecipeFilter;
