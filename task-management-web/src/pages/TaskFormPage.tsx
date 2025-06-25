// src/pages/TaskFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createTask, updateTask, getTaskById } from '../api/taskService';
import type { Task } from '../types';
import './TaskFormPage.css'; // Create this CSS file

const TaskFormPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get task ID from URL for editing
  const location = useLocation(); // To access state passed from navigate

  const isEditMode = !!id; // True if ID exists in URL

  useEffect(() => {
    // If in edit mode, fetch task data
    if (isEditMode && id) {
      const fetchTask = async () => {
        setLoading(true);
        setError(null);
        try {
          // Check if task data was passed via state (from HomePage edit click)
          const passedTask = location.state?.task as Task | undefined;

          if (passedTask && passedTask._id === id) {
            // Use passed data if available and matches ID
            setTitle(passedTask.title);
            setDescription(passedTask.description || '');
            setCompleted(passedTask.completed);
          } else {
            // Otherwise, fetch from API
            const fetchedTask = await getTaskById(id);
            setTitle(fetchedTask.title);
            setDescription(fetchedTask.description || '');
            setCompleted(fetchedTask.completed);
          }
        } catch (err: any) {
          console.error('Error fetching task for edit:', err);
          setError(err.response?.data?.msg || 'Failed to load task.');
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, isEditMode, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        // Update existing task
        await updateTask(id, title, description, completed);
      } else {
        // Create new task
        await createTask(title, description);
      }
      navigate('/'); // Redirect to homepage after success
    } catch (err: any) {
      console.error('Error submitting task:', err);
      setError(err.response?.data?.msg || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div>Loading task data...</div>;
  }

  return (
    <div className="task-form-container">
      <h2>{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></textarea>
        </div>
        {isEditMode && (
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <label htmlFor="completed">Completed</label>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
        </button>
        <button type="button" onClick={() => navigate('/')} className="cancel-button" disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TaskFormPage;
