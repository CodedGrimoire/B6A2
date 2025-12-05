import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error | unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => 
  
  
  {
  
  const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
  const errorStack = err instanceof Error ? err.stack : undefined;
  
  console.error('Error:', errorMessage);


  if (errorStack)
    
    
  {
    console.error('Stack:', errorStack);
  }

 
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
 
  if (errorMessage.includes('Email already exists')) 
    
    
  {
    statusCode = 400; 
  } 
  
  
  else if (errorMessage.includes('Invalid credentials'))
    
    
    {
    statusCode = 401; 
  } 
  
  
  else if (errorMessage.includes('Access denied') || errorMessage.includes('Forbidden'))
    
    
    {
    statusCode = errorMessage.includes('Forbidden') ? 403 : 401;
  } 
  
  
  else if (errorMessage.includes('not found')) 
    
    
    {
    statusCode = 404; 
  } 
  
  
  else if (errorMessage.includes('not available') || errorMessage.includes('cannot be')) 
    
    {
    statusCode = 400; 
  }

  res.status(statusCode);
  res.json({
    success: false,
    message: errorMessage,
    errors: errorMessage,
  });
};