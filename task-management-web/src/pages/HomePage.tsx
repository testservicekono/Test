// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, updateTask, deleteTask } from '../api/taskService';
import type { Task } from '../types';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css'; // Create this CSS file

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth(); // Destructure loading as authLoading to avoid conflict

  // Function to fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return; // Only fetch if authenticated
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.msg || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Dependency on isAuthenticated

  // Initial fetch when component mounts or auth status changes
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchTasks();
    }
  }, [authLoading, isAuthenticated, fetchTasks]); // Depend on authLoading, isAuthenticated, and fetchTasks

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      // Find the task to get its current title and description
      const taskToUpdate = tasks.find(task => task._id === id);
      if (!taskToUpdate) {
        console.error('Task not found for toggling completion.');
        return;
      }

      const updated = await updateTask(id, taskToUpdate.title, taskToUpdate.description, completed);
      setTasks(tasks.map((task) => (task._id === id ? updated : task)));
    } catch (err: any) {
      console.error('Error toggling task completion:', err);
      setError(err.response?.data?.msg || 'Failed to update task completion.');
    }
  };

  const handleEdit = (task: Task) => {
    navigate(`/edit-task/${task._id}`, { state: { task } }); // Pass task data via state
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((task) => task._id !== id));
      } catch (err: any) {
        console.error('Error deleting task:', err);
        setError(err.response?.data?.msg || 'Failed to delete task.');
      }
    }
  };

  if (authLoading) {
    return <div>Loading user authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your tasks.</div>; // Should be redirected by PrivateRoute, but good fallback
  }

  return (
    <div className="homepage-container">
      <h2>My Tasks</h2>
      <button className="add-task-button" onClick={() => navigate('/create-task')}>
        Add New Task
      </button>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Start by adding a new task!</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
