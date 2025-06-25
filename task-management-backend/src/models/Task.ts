// src/models/Task.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Define a TypeScript interface for our Task document
export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: Types.ObjectId; // Reference to the User who owns this task
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Schema for Task
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    completed: {
      type: Boolean,
      default: false, // Default value for new tasks
    },
    user: {
      type: Schema.Types.ObjectId, // This is how you reference another model
      ref: 'User', // The name of the model to reference
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Mongoose Model
const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
