import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { pool, createTables } from './db';
import authRoutes from './auth/authRoutes';
import usersRoutes from './users/usersRoutes';
import vehiclesRoutes from './vehicles/vehiclesRoutes';
import bookingsRoutes from './bookings/bookingsRoutes';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const port = 3000;

app.use(express.json());

async function testDbConnection() {
  try {
    console.log('Attempting to connect to the database...');
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`Successfully connected to database at ${res.rows[0].now}`);
    client.release();
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
}

app.listen(port, async () => {
  try {
    console.log(`App listening on port ${port}`);
    await testDbConnection();
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/setup-db', async (req, res) => {
  try {
    await createTables();
    res.send('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).send('Error creating tables');
  }
});

// Mount the routers
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/bookings', bookingsRoutes);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
