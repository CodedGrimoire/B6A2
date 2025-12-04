// src/server.ts
import express from 'express';
import authRoutes from './auth/authRoutes';
import usersRoutes from './users/usersRoutes';
import vehiclesRoutes from './vehicles/vehiclesRoutes';
import bookingsRoutes from './bookings/bookingsRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/vehicles', vehiclesRoutes);
app.use('/api/v1/bookings', bookingsRoutes);

// Global error handler - should be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
