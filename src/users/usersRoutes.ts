// src/users/usersRoutes.ts
import { Router } from 'express';
import * as usersController from './usersController';
import { authenticate } from '../auth/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All user routes are admin-only
router.use(authenticate, isAdmin);

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router;
