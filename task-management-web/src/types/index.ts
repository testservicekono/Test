// src/types/index.ts

// Define the User type that we expect from the backend after login/registration
export interface User {
  _id: string;
  email: string;
  createdAt: string; // Dates are often strings when received from API
  updatedAt: string;
}

// Define the Task type
export interface Task {
  _id: string;
  title: string;
  description?: string; // Optional
  completed: boolean;
  user: string; // User ID as string
  createdAt: string;
  updatedAt: string;
}
