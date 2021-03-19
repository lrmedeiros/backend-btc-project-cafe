import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { LoginController } from './controllers/LoginController';
import { RegisterController } from './controllers/RegisterController';
import { SendMailController } from './controllers/SendMailController';
import { ResetPasswordController } from './controllers/ResetPasswordController';

const router = Router();

const loginController = new LoginController();
const registerController = new RegisterController();
const authController = new AuthController();
const sendMailController = new SendMailController();
const resetPasswordController = new ResetPasswordController();

router.post('/login', loginController.execute);
router.get('/auth', authController.execute);
router.post('/register', registerController.create);
router.post('/forgot-password', sendMailController.execute);
router.post('/reset-password/:token', resetPasswordController.execute);

export { router };
