// src/api/taskService.ts
import axiosInstance from './axiosInstance';
import type { Task } from '../types';

// Function to create a new task
export const createTask = async (title: string, description?: string): Promise<Task> => {
  const response = await axiosInstance.post<Task>('/tasks', { title, description });
  return response.data;
};

// Function to get all tasks for the authenticated user
export const getTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get<Task[]>('/tasks');
  return response.data;
};

// Function to get a single task by ID
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await axiosInstance.get<Task>(`/tasks/${id}`);
  return response.data;
};

// Function to update an existing task
export const updateTask = async (
  id: string,
  title: string,
  description: string | undefined, // Can be string or undefined
  completed: boolean
): Promise<Task> => {
  const response = await axiosInstance.put<Task>(`/tasks/${id}`, { title, description, completed });
  return response.data;
};

// Function to delete a task
export const deleteTask = async (id: string): Promise<{ msg: string }> => {
  const response = await axiosInstance.delete<{ msg: string }>(`/tasks/${id}`);
  return response.data;
};
