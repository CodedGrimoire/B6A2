// src/auth/authRoutes.ts
import { Router } from 'express';
import { signup, signin } from './authController';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);

export default router;
