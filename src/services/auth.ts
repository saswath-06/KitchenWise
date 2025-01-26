import axios from 'axios';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    username: string;
    _id: string;
  };
  token: string;
}

const AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const auth = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${AUTH_URL}/login`, credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${AUTH_URL}/register`, credentials);
    return response.data;
  },

  async validateToken(): Promise<boolean> {
    try {
      await axios.get(`${AUTH_URL}/validate-token`);
      return true;
    } catch {
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default auth;