// src/auth/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Ensure the user is authenticated (i.e., user info is attached to req.user)
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admins only.' });
  }

  next(); // User is admin, proceed to the next middleware or route handler
};
