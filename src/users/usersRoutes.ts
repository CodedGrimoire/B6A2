
import { Router } from 'express';
import * as usersController from './usersController';

import { isAdmin } from '../middleware/roleMiddleware';


import { authenticate } from '../auth/authMiddleware';

const router = Router();

router.get('/', authenticate, isAdmin, usersController.getUsers);
router.put('/:userId', authenticate, usersController.updateUser);
router.delete('/:userId', authenticate, isAdmin, usersController.deleteUser);

export default router;
