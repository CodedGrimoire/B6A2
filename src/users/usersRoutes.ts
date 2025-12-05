// src/users/usersRoutes.ts
import { Router } from 'express';
import * as usersController from './usersController';
import { authenticate } from '../auth/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', authenticate, isAdmin, usersController.getUsers);
router.put('/:userId', authenticate, usersController.updateUser);
router.delete('/:userId', authenticate, isAdmin, usersController.deleteUser);

export default router;
