// src/vehicles/vehiclesRoutes.ts
import { Router } from 'express';
import * as vehiclesController from './vehiclesController';
import { authenticate } from '../auth/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', vehiclesController.getVehicles);
router.get('/:vehicleId', vehiclesController.getVehicle);
router.post('/', authenticate, isAdmin, vehiclesController.addVehicle);
router.put('/:vehicleId', authenticate, isAdmin, vehiclesController.updateVehicle);
router.delete('/:vehicleId', authenticate, isAdmin, vehiclesController.deleteVehicle);

export default router;
