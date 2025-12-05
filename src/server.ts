import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { pool, createTables } from './db';
import authRoutes from './auth/authRoutes';
import usersRoutes from './users/usersRoutes';
import vehiclesRoutes from './vehicles/vehiclesRoutes';
import bookingsRoutes from './bookings/bookingsRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

const app = express();
const port = 3000;

app.use(express.json());

// Database connection check and table initialization
async function initializeDatabase() {
  try {
    console.log('Attempting to connect to the database...');
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`Successfully connected to database at ${res.rows[0].now}`);
    client.release();
    
    // Automatically create tables on startup
    console.log('Initializing database tables...');
    await createTables();
    console.log('Database tables initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

// Routes setup
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Setup database tables route (for manual re-initialization if needed)
app.get('/setup-db', async (req, res, next) => {
  try {
    console.log('Setting up the database...');
    await createTables();  // Create tables
    res.send('Tables created successfully!');
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/bookings', bookingsRoutes);

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// Start server and initialize database
app.listen(port, async () => {
  try {
    console.log(`App listening on port ${port}`);
    await initializeDatabase();
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
});

// Global error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
