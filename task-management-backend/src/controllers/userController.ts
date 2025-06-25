// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email }) as (any | null);
    if (user) {
      res.status(400).json({ msg: 'User already exists' });
      return;
    }

    // Create new user instance
    user = new User({ email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    if (user.password) { // Ensure password is not undefined before hashing
      user.password = await bcrypt.hash(user.password, salt);
    } else {
      res.status(500).json({ msg: 'Password missing for hashing' });
      return;
    }

    // Save user to database
    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user._id.toString(), // Mongoose models have an 'id' getter for _id
      },
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined!');
      res.status(500).json({ msg: 'Server error: JWT secret not configured.' });
      return;
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }) as (typeof User & { _id: any, password?: string }) | null;
    if (!user) {
      res.status(400).json({ msg: 'Invalid Credentials' });
      return;
    }

    // Compare provided password with hashed password
    // Ensure both user.password and provided password exist
    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      res.status(400).json({ msg: 'Invalid Credentials' });
      return;
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user._id.toString(),
      },
    };

    console.log('JWT Payload:', payload);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined!');
      res.status(500).json({ msg: 'Server error: JWT secret not configured.' });
      return;
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/auth/user
// @desc    Get user data by token (protected route)
// @access  Private
export const getAuthenticatedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user.id is populated by our authMiddleware
    const user = await User.findById(req.user?.id).select('-password') as (typeof User & { _id: any }) | null; // Exclude password from the returned user object
    //const user = await User.findById(req.user?.id).select('-password') as (any | null); // Exclude password from the returned user object
    console.log('Authenticated User:', user);
    if (!user) {
      res.status(404).json({ msg: 'User not founded' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
