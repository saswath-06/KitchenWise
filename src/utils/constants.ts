// src/utils/constants.ts
export const API_ENDPOINTS = {
    AUTH: '/auth',
    INGREDIENTS: '/ingredients',
    RECEIPTS: '/receipts',
    RECIPES: '/recipes'
  } as const;
  
  export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
  } as const;
  
  // src/utils/helpers.ts
  export const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };
  
  export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };
  
  export const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };