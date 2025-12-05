
import { Request, Response, NextFunction } from 'express';


import * as bookingsService from './bookingsService';

export const createBooking = async (req: Request, res: Response, next: NextFunction) =>
  {



  try
  
  
  {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
    const userRole = req.user?.role;


    const userId = req.user?.userId;

   
    if (userRole === 'customer' && customer_id !== userId) 
      
      
      {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: 'Customers can only create bookings for themselves',
      });
    }

    const booking = await bookingsService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try {

    const userRole = req.user?.role;
    const userId = req.user?.userId;


   

    const bookings = await bookingsService.getAllBookings(userId, userRole);

    const message = userRole === 'admin' 
      ? 'Bookings retrieved successfully'
      : 'Your bookings retrieved successfully';

    res.status(200).json(
      
      {
      success: true,
      message,
      data: bookings,
    });
  }
  
  
  catch (error) 
  
  
  {
    next(error);
  }
};



export const updateBooking = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try {
    const bookingId = Number(req.params.bookingId);

    const userId = req.user?.userId;


    const { status } = req.body;
    const userRole = req.user?.role;
   

    if (!status || !['cancelled', 'returned'].includes(status))
      
      
      {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
        errors: 'Status must be either "cancelled" or "returned"',
      });


    }

    if (!userRole) 
      
      {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: 'User role not found',
      });
    }


    const booking = await bookingsService.updateBooking(bookingId, status, userRole, userId);

    let message = '';
    if (status === 'cancelled')
      
      
      {
      message = 'Booking cancelled successfully';
    } 
    
    
    else if (status === 'returned')
      
      
      {
      message = 'Booking marked as returned. Vehicle is now available';
    }

    res.status(200).json(
      
      
      {
      success: true,
      message,
      data: booking,
    });



  } 
  
  
  catch (error) 
  
  
  {
    next(error);
  }
};
