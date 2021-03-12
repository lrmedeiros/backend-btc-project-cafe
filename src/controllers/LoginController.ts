import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import * as yup from 'yup';

import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';

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

    if (login) {
      const token = sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: 100000, // expires in 5min
      });

      return res
        .status(200)
        .json({ message: 'Login sucess!', token })
        .redirect('/tabs');
    }
    return res.status(400).json({ message: 'Login fail!', UserData });
  }
}

export { LoginController };
