// src/types/express.d.ts
// This file extends the Express Request interface to include a 'user' property.
import { Request } from 'express';
// This declaration merges with the existing 'express-serve-static-core' module.
declare namespace Express {
  export interface Request {
    user?: {
      id: string; // The user ID (from MongoDB _id)
    };
  }
}
