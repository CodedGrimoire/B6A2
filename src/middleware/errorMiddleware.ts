import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the full error for debugging
  console.error('Error:', err.message);
  if (err.stack) {
    console.error('Stack:', err.stack);
  }

  // Determine status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set appropriate status codes for common errors
  if (err.message.includes('Email already exists')) {
    statusCode = 409; // Conflict
  } else if (err.message.includes('Invalid credentials')) {
    statusCode = 401; // Unauthorized
  } else if (err.message.includes('Access denied') || err.message.includes('Forbidden')) {
    statusCode = err.message.includes('Forbidden') ? 403 : 401;
  } else if (err.message.includes('not found')) {
    statusCode = 404; // Not Found
  }

  res.status(statusCode);
  res.json({ error: err.message });
};