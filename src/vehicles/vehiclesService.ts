
import { pool } from '../db';




import { Vehicle } from '../types';

export const getAllVehicles = async (): Promise<Vehicle[]> => 
  
  
  
  {
  const result = await pool.query('SELECT * FROM vehicles');


  return result.rows;
};

export const getVehicleById = async (id: number): Promise<Vehicle | undefined> => 
  
  
  
  {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);


  return result.rows[0];


};

export const addVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string): Promise<Vehicle> =>
  
  
  {
  const result = await pool.query(
    'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );



  return result.rows[0];
};

export const updateVehicle = async (
  id: number,
  vehicle_name?: string,
  type?: string,
  registration_number?: string,


  daily_rent_price?: number,
  availability_status?: string
): Promise<Vehicle | undefined> => 
  
  
  
  {
  const updates: string[] = [];
  const values: (string | number)[] = [];
  let paramIndex = 1;

  if (vehicle_name !== undefined) 
    
    
    {
    updates.push(`vehicle_name = $${paramIndex++}`);
    values.push(vehicle_name);
  }


  if (type !== undefined) 
    
    
    {
    updates.push(`type = $${paramIndex++}`);
    values.push(type);
  }
  if (registration_number !== undefined) 
    
    
    {
    updates.push(`registration_number = $${paramIndex++}`);
    values.push(registration_number);
  }
  if (daily_rent_price !== undefined) 
    
    
    {
    updates.push(`daily_rent_price = $${paramIndex++}`);
    values.push(daily_rent_price);
  }




  if (availability_status !== undefined)
    
    
    
    {
    updates.push(`availability_status = $${paramIndex++}`);
    values.push(availability_status);
  }

  if (updates.length === 0) 
    
    
    
    {
   
    return await getVehicleById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,


    values
  );
  return result.rows[0];


};

export const deleteVehicle = async (id: number): Promise<Vehicle | undefined> =>
  
  
  
  
  {
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
