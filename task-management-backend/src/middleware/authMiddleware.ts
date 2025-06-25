// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Define a type for the decoded JWT payload
interface JwtPayload {
  user: { id: string; }; // This will be the user's MongoDB _id
  iat?: number;
  exp?: number;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const token = req.header('x-auth-token'); // Common header name for tokens

  // Check if no token
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denieded' });
    return;
  }

  // Verify token
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined!');
      res.status(500).json({ msg: 'Server error: JWT secret not configured.' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    console.log('Decoded Token:', decoded);
    // Attach user information to the request object
    // This is where our extended Request interface in src/types/express.d.ts comes in handy
    req.user = { id: decoded.user.id };
    next(); // Proceed to the next middleware/route handler
  } catch (err: any) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;
