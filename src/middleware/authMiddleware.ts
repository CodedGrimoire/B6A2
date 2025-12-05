
import jwt from 'jsonwebtoken';

import { UserPayload } from '../types';

import { Request, Response, NextFunction } from 'express';




declare global 

{
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) 
    
    
  {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try 
  
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload; 
    req.user = decoded; 
    next(); 
  } 
  
  catch (error) 
  
  
  {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
