
import { Request, Response, NextFunction } from 'express';


import * as authService from './authService';

export const signup = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try 
  {
    const { name, email, password, phone, role } = req.body;


    const user = await authService.signup(name, email, password, phone, role);
   
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userWithoutPassword,
    });


  } 
  
  catch (error)
  
  {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => 
  
  {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.signin(email, password);
    
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } 
  
  catch (error) 
  
  
  {
    next(error);
  }
};
