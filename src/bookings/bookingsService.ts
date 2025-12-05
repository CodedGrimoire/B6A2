
import { BookingWithRelations } from '../types';


import { pool } from '../db';



export const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
): Promise<BookingWithRelations> => 
  
  
  {
 
  const vehicleResult = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);
  if (vehicleResult.rows.length === 0)
    
    
    {
    throw new Error('Vehicle not found');
  }
  const vehicle = vehicleResult.rows[0];
  
  if (vehicle.availability_status !== 'available')
    
    {
    throw new Error('Vehicle is not available');
  }

  
  const startDate = new Date(rent_start_date);


  const endDate = new Date(rent_end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) 
    
  {
    throw new Error('Rent start date cannot be in the past');
  }

  if (endDate <= startDate)
    
    
  {
    throw new Error('Rent end date must be after start date');
  }

 
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  
  const total_price = parseFloat(vehicle.daily_rent_price) * daysDiff;

  
  const client = await pool.connect();

  try 
  
  {
    await client.query('BEGIN');

    
    const bookingResult = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

   
    await client.query(
      'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
      ['booked', vehicle_id]
    );

    await client.query('COMMIT');


    const booking = bookingResult.rows[0];
    return {
      ...booking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } 
  
  
  catch (error) 
  
  
  {
    await client.query('ROLLBACK');
    throw error;
  } 
  
  
  finally 
  
  
  {
    client.release();
  }
};

export const getAllBookings = async (userId?: number, userRole?: string): Promise<BookingWithRelations[]> => {
  let query = `
    SELECT 
      b.*,
      u.name as customer_name,
      u.email as customer_email,
      v.vehicle_name,
      v.registration_number,
      v.type as vehicle_type
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
  `;
  const params: (string | number)[] = [];

  
  if (userRole === 'customer' && userId) 
    
    
    {
    query += ' WHERE b.customer_id = $1';
    params.push(userId);
  }

  query += ' ORDER BY b.id DESC';

  const result = await pool.query(query, params);
  return result.rows.map((row): BookingWithRelations => 
    
    
    {
    if (userRole === 'admin')
      
      
      {
      return {
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      };
    } else {
     
      return {
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.vehicle_type,
        },
      };


      
    }
  });
};

export const updateBooking = async (bookingId: number, status: string, userRole: string, userId?: number): Promise<BookingWithRelations> => 
  
  
  {
  
  const bookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);



  if (bookingResult.rows.length === 0) 
    
    
    {
    throw new Error('Booking not found');
  }
  const booking = bookingResult.rows[0];

  
  if (userRole === 'customer')
    
    
    {
    if (booking.customer_id !== userId) 
      
      
      {
      throw new Error('You can only update your own bookings');
    }
    if (status !== 'cancelled') 
      
      
    {
      throw new Error('Customers can only cancel bookings');
    }
   
    const startDate = new Date(booking.rent_start_date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate <= today) 
      
    {
      throw new Error('Cannot cancel booking after start date');
    }
  } 
  
  else if (userRole === 'admin') 
    
    
    {
    if (status !== 'returned')
      
      
      {
      throw new Error('Admins can only mark bookings as returned');
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

   
    const updateResult = await client.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, bookingId]
    );

   
    if (status === 'cancelled' || status === 'returned') 
      
      
      {
      await client.query(
        'UPDATE vehicles SET availability_status = $1 WHERE id = $2',


        ['available', booking.vehicle_id]
      );
    }

    const updatedBooking = updateResult.rows[0];
    
    if (status === 'returned') 
      
      
      {


      const vehicleResult = await client.query('SELECT availability_status FROM vehicles WHERE id = $1', [booking.vehicle_id]);
      await client.query('COMMIT');
      return {
        ...updatedBooking,
        vehicle: {
          availability_status: vehicleResult.rows[0].availability_status,
        },
      };
    }

    await client.query('COMMIT');
    return updatedBooking;
  } 
  
  
  catch (error) 
  
  
  {
    await client.query('ROLLBACK');
    throw error;


  } 
  
  finally 
  
  {
    client.release();
  }
};
