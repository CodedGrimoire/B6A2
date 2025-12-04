// src/auth/authController.ts
import { Request, Response } from 'express';
import * as authService from './authService';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await authService.signup(name, email, password, phone, role);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.signin(email, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: 'An unknown error occurred.' });
    }
  }
};
