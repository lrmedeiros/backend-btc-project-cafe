import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { LoginController } from './controllers/LoginController';
import { RegisterController } from './controllers/RegisterController';

const router = Router();

const loginController = new LoginController();
const registerController = new RegisterController();
const authController = new AuthController();

router.post('/login', loginController.execute);
router.get('/auth', authController.execute);
router.post('/register', registerController.create);

export { router };
