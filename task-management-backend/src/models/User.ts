// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define a TypeScript interface for our User document
// This extends Document from Mongoose, giving it _id, __v etc.
export interface IUser extends Document {
  email: string;
  password?: string; // Password will be hashed, so it's optional for some operations (e.g., fetching a user without sensitive data)
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Schema for User
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Remove whitespace from both ends of a string
      lowercase: true, // Convert email to lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Mongoose Model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
