// src/components/TaskItem.tsx
import React from 'react';
import type { Task } from '../types';
import './TaskItem.css'; // Create this CSS file

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
      </div>
      <div className="task-actions">
        <button
          className="action-button toggle-button"
          onClick={() => onToggleComplete(task._id, !task.completed)}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button className="action-button edit-button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="action-button delete-button" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
