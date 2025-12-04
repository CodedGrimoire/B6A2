// src/vehicles/vehiclesRoutes.ts
import { Router } from 'express';
import * as vehiclesController from './vehiclesController';
import { authenticate } from '../auth/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', vehiclesController.getVehicles);
router.get('/:id', vehiclesController.getVehicle);
router.post('/', authenticate, isAdmin, vehiclesController.addVehicle);
router.put('/:id', authenticate, isAdmin, vehiclesController.updateVehicle);
router.delete('/:id', authenticate, isAdmin, vehiclesController.deleteVehicle);

export default router;
