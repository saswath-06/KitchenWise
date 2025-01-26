import axios, { AxiosInstance } from 'axios';
import { AuthResponse, Ingredient, Recipe, Receipt } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  // Ingredients
  async getIngredients(): Promise<Ingredient[]> {
    const response = await this.api.get<Ingredient[]>('/ingredients');
    return response.data;
  }

  async addIngredient(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const response = await this.api.post<Ingredient>('/ingredients', ingredient);
    return response.data;
  }

  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<Ingredient> {
    const response = await this.api.patch<Ingredient>(`/ingredients/${id}`, updates);
    return response.data;
  }

  async deleteIngredient(id: string): Promise<void> {
    await this.api.delete(`/ingredients/${id}`);
  }

  // Receipts
  async uploadReceipt(file: File): Promise<Receipt> {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await this.api.post<Receipt>('/receipts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getReceipts(): Promise<Receipt[]> {
    const response = await this.api.get<Receipt[]>('/receipts');
    return response.data;
  }

  // Recipes
  async getSuggestedRecipes(cuisine?: string): Promise<Recipe[]> {
    const response = await this.api.get<Recipe[]>('/recipes/suggest', {
      params: { cuisine },
    });
    return response.data;
  }

  async markRecipeAsCooked(recipeId: string): Promise<void> {
    await this.api.post(`/recipes/${recipeId}/cooked`);
  }

  async toggleFavoriteRecipe(recipeId: string): Promise<Recipe> {
    const response = await this.api.patch<Recipe>(`/recipes/${recipeId}/favorite`);
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;