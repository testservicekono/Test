// src/controllers/taskController.ts
import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import { Types } from 'mongoose'; // Import Types for ObjectId

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
export const createTask = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  try {
    // req.user.id is populated by the authMiddleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ msg: 'User not authenticated' });
    }

    const newTask = new Task({
      title,
      description,
      user: userId, // Assign the task to the authenticated user
    }) as ITask;

    const task = await newTask.save();
    res.status(201).json(task); // 201 Created status
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ msg: 'User not authenticated' });
    }

    // Find all tasks that belong to the authenticated user, sorted by creation date
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/tasks/:id
// @desc    Get a single task by ID for the authenticated user
// @access  Private
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id;

    if (!userId) {
      res.status(401).json({ msg: 'User not authenticated' });
    }

    // Check if the provided task ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ msg: 'Invalid task ID' });
    }

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      res.status(404).json({ msg: 'Task not found or not authorized' });
    }

    res.json(task);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
export const updateTask = async (req: Request, res: Response) => {
  const { title, description, completed } = req.body;
  const taskId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ msg: 'User not authenticated' });
  }

  // Build task object
  const taskFields: Partial<ITask> = {};
  if (title) taskFields.title = title;
  if (description !== undefined) taskFields.description = description; // Allow empty string for description
  if (completed !== undefined) taskFields.completed = completed; // Allow false for completed

  try {
    // Check if the provided task ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ msg: 'Invalid task ID' });
    }

    let task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      res.status(404).json({ msg: 'Task not found or not authorized' });
    }

    // Update the task
    task = await Task.findByIdAndUpdate(
      taskId,
      { $set: taskFields },
      { new: true } // Return the updated document
    );

    res.json(task);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    // Check if the provided task ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ msg: 'Invalid task ID' });
    }

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      res.status(404).json({ msg: 'Task not found or not authorized' });
    }

    await Task.deleteOne({ _id: taskId, user: userId }); // Use deleteOne with filter
    res.json({ msg: 'Task removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
