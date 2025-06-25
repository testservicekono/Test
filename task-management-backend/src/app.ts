// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json()); // Allows us to get data in req.body
app.use(cors()); // Enable CORS for all routes

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Global Error Handler (optional, but good practice for production)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
