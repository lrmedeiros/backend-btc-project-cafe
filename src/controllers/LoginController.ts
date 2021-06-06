import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';
import errorMessages from '../const/errorMessages';
import sucessMessages from '../const/sucessMessages';
import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';
import { refresh } from '../utils/refresh';

class LoginController {
  async execute(req: Request, res: Response) {
    const { nickname, password } = req.body;

    const schema = yup.object().shape({
      nickname: yup.string().required(),
      password: yup.string().required(),
    });

    try {
      schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const UserData = {
      nickname,
      password,
    };

    const db = await connectionToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('users');

    const user = await collection.findOne({ nickname });

    let login: boolean;

    if (user) {
      const passwordDb = user.password;
      login = await compare(UserData.password, passwordDb);
    }

    if (!login)
      return res.status(400).json({ message: errorMessages.LOGIN_FAIL });

    const token = sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: 60 * 60, // 1 hora
    });

    return res
      .status(200)
      .json({ message: sucessMessages.LOGIN_SUCESS, token });
  }
  async refreshToken(request: Request, response: Response) {
    const { token } = request.body;

    const newToken = refresh(token);

    return response.json(newToken).status(400);
  }
}

export { LoginController };
