import { useEffect, useState } from 'react';
import { fetchAPI } from '../utils/api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [cuisine, setCuisine] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [cuisine]);

  async function fetchRecipes() {
    try {
      const response = await fetchAPI(`/recipes/suggest?cuisine=${cuisine}`);
      setRecipes(response);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Recipes</h1>
      <select onChange={(e) => setCuisine(e.target.value)}>
        <option value="">All Cuisines</option>
        <option value="Mexican">Mexican</option>
        <option value="Indian">Indian</option>
        <option value="American">American</option>
        <option value="Italian">Italian</option>
      </select>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <a href={`/recipe/${recipe.id}`}>{recipe.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
