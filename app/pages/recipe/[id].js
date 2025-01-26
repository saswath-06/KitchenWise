import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchAPI } from '../../utils/api';

export default function RecipeDetails() {
  const { query } = useRouter();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (query.id) fetchRecipeDetails();
  }, [query.id]);

  async function fetchRecipeDetails() {
    try {
      const response = await fetchAPI(`/recipes/${query.id}`);
      setRecipe(response);
    } catch (err) {
      console.error(err);
    }
  }

  return recipe ? (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      <button onClick={() => alert('Ingredients checked and removed!')}>
        Mark as Cooked
      </button>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
