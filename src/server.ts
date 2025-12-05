import express from 'express';

import path from 'path';

import dotenv from 'dotenv';

import { pool, createTables } from './db';
import authRoutes from './auth/authRoutes';

import vehiclesRoutes from './vehicles/vehiclesRoutes';

import bookingsRoutes from './bookings/bookingsRoutes';

import usersRoutes from './users/usersRoutes';

import { errorHandler } from './middleware/errorMiddleware';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (!process.env.JWT_SECRET) 
  
  {
  console.error('JWT_SECRET is not defined.');
  process.exit(1);
}

const app = express();
const port = 3000;

app.use(express.json());


async function initializeDatabase() 

{
  try {
    console.log('Attempting to connect to the database.......');
    const client = await pool.connect();


    const res = await client.query('SELECT NOW()');
    console.log(`Successfully connected to database at ${res.rows[0].now}`);
    client.release();
    
    
    console.log('Initializing database tables...');

    await createTables();

    console.log('Database tables initialized successfully!');
  } 
  
  catch (err) 
  
  {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}


app.get('/', (req, res) => 
  {
  res.send('Helath check! working good');
});


app.get('/setup-db', async (req, res, next) => 
  
  {
  try 
  
  {
    console.log('Setting up the database...');
    await createTables();  // Create tables
    res.send('Tables created successfully!');
  } 
  
  catch (error) 
  
  {
    next(error); 
  }
});

//shob rpoutess
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/vehicles', vehiclesRoutes);
app.use('/api/v1/bookings', bookingsRoutes);


app.use(errorHandler);


app.listen(port, async () => 
  {
  try {
    console.log(`App listening on port ${port}`);



    await initializeDatabase();
  } 
  
  catch (error)
  
  
  {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
});


process.on('uncaughtException', (err) => 
  
  
  {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) =>
  
  
{
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
