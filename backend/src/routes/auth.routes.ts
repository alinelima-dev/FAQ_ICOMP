import { Router } from 'express';
import container from '../container/inversify.config';
import TYPES from '../types';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/login', authController.login);

export default router;
