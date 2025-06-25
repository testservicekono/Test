// src/routes/taskRoutes.ts
import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// All task routes are private, so they use authMiddleware
router.post('/', authMiddleware, createTask); // Create task
router.get('/', authMiddleware, getTasks);   // Get all tasks
router.get('/:id', authMiddleware, getTaskById); // Get single task by ID
router.put('/:id', authMiddleware, updateTask); // Update task by ID
router.delete('/:id', authMiddleware, deleteTask); // Delete task by ID

export default router;
