import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // Load environment variables from project root

const app = express();
const port = 3000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,  // Use environment variable for connection string
});

// Test database connection
async function testDbConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Database connected:', res.rows[0].now);  // Log successful connection
    client.release();
  } catch (err) {
    console.error('Error connecting to database:', err);  // Log connection error
    process.exit(1);  // Exit process if database connection fails
  }
}

// Start the server
app.listen(port, async () => {
  try {
    console.log(`App listening on port ${port}`);
    await testDbConnection(); // Ensure DB is connected before starting server
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);  // Exit if the server cannot start
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create tables route
app.get('/create-tables', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('Creating tables...');
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
    res.send('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).send('Error creating tables');
  } finally {
    client.release();
  }
});

// Global error handler for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);  // Exit the process to prevent further issues
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);  // Exit the process to prevent further issues
});
