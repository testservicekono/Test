// src/api/authService.ts
import axiosInstance from './axiosInstance';
import type { User } from '../types';

interface AuthResponse {
  token: string;
}

// Function to register a new user
export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', { email, password });
  return response.data;
};

// Function to log in a user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

// Function to get the authenticated user's data
export const getAuthUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/user');
  return response.data;
};
