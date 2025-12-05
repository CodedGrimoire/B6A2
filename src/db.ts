import { Pool } from 'pg';


export const pool = new Pool({


  connectionString: process.env.CONNECTION_STRING, });



export async function createTables() 


{
  const client = await pool.connect();
  try {
    console.log('Creating tables.....');

    
    await client.query('BEGIN'); 

    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(10) CHECK(role IN ('admin', 'customer')) NOT NULL
      );


      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(20) CHECK(type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10, 2) CHECK(daily_rent_price > 0) NOT NULL,
        availability_status VARCHAR(20) CHECK(availability_status IN ('available', 'booked')) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        vehicle_id INTEGER REFERENCES vehicles(id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price DECIMAL(10, 2) CHECK(total_price > 0) NOT NULL,
        status VARCHAR(20) CHECK(status IN ('active', 'cancelled', 'returned')) NOT NULL
      );
    `);


    console.log('Tables created successfully!!!');

    
    await client.query('COMMIT');
  }
  
  catch (error) 
  
  {
    
    console.error('Error creating tables:', error);


    await client.query('ROLLBACK');
  } 
  
  finally 
  
  {
  
    client.release();
  }
}
