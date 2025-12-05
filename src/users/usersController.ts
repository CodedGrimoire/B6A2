
import { Request, Response, NextFunction } from 'express';


import * as usersService from './usersService';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try 
  
  
  {
    const users = await usersService.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } 
  
  
  catch (error) 
  
  
  {
    next(error);
  }
};



export const updateUser = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try 
  
  
  {
    const userId = Number(req.params.userId);
    const { name, email, phone, role } = req.body;
    
   
    const requestingUserId = req.user?.userId;
    const requestingUserRole = req.user?.role;
    
    if (requestingUserRole !== 'admin' && requestingUserId !== userId) 
      
      
      {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: 'You can only update your own profile',
      });
    }
    
    
    if (requestingUserRole !== 'admin' && role !== undefined) 
      
      
      {
      const currentUser = await usersService.getUserById(userId);



      if (!currentUser)
        
        
        {
        return res.status(404).json({
          success: false,
          message: 'User not found',


          errors: 'User not found',
        });


      }

      if (role !== currentUser.role) 
        
        
        {
        return res.status(403).json(
          
          
          {
          success: false,
          message: 'Forbidden',
          errors: 'Customers cannot change their role',
        });
      }
    }
    
    const user = await usersService.updateUser(userId, name, email, phone, role);
    if (!user) 
      
      
      {
      return res.status(404).json(
        
        
        {
        success: false,
        message: 'User not found',


        errors: 'User not found',
      });
    }
    
    res.status(200).json(
      
      
      {
      success: true,
      message: 'User updated successfully',



      data: user,
    });
  } 
  
  
  catch (error) 
  
  
  {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try 
  
  
  {
    const user = await usersService.deleteUser(Number(req.params.userId));
    if (!user) 
      
      
      {
      return res.status(404).json(
        
        
        
        {
        success: false,
        message: 'User not found',

        errors: 'User not found',



      });



    }
    res.status(200).json(
      
      
      
      {
      success: true,
      message: 'User deleted successfully',
    });


  } 
  
  
  catch (error) 
  
  
  
  
  {
    next(error);
  }
};
