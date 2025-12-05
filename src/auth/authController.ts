// src/auth/authController.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from './authService';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await authService.signup(name, email, password, phone, role);
    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.signin(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
};
