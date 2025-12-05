
import { Router } from 'express';
import * as bookingsController from './bookingsController';
import { authenticate } from '../auth/authMiddleware';

const router = Router();

router.post('/', authenticate, bookingsController.createBooking);
router.get('/', authenticate, bookingsController.getBookings);
router.put('/:bookingId', authenticate, bookingsController.updateBooking);

export default router;