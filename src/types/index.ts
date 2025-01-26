export interface User {
    id: string;
    name: string;
    email: string;
    preferences?: UserPreferences;
  }
  
  export interface UserPreferences {
    cuisinePreferences?: string[];
    dietaryRestrictions?: string[];
    mealPlanningEnabled?: boolean;
  }
  
  export interface Ingredient {
    _id: string;
    name: string;
    quantity: number;
    unit: string;
    user: string;
    dateAdded: Date;
    source: 'receipt' | 'manual';
    expiryDate?: Date;
  }
  
  export interface Recipe {
    _id: string;
    title: string;
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
      required: boolean;
    }[];
    instructions: {
      step: number;
      text: string;
    }[];
    cuisine?: string;
    cookingTime: {
      prep: number;
      cook: number;
    };
    servings: number;
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    difficulty: 'easy' | 'medium' | 'hard';
    isFavorite: boolean;
    user: string;
  }
  
  export interface Receipt {
    _id: string;
    imagePath: string;
    originalName: string;
    processedItems: {
      name: string;
      quantity: number;
      unit: string;
      confidence: number;
    }[];
    dateUploaded: Date;
    store?: string;
    totalAmount?: number;
    processed: boolean;
    processingError?: string;
    user: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface ApiError {
    message: string;
    error?: string;
  }