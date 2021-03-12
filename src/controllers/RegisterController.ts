import { Request, Response } from 'express';
import { connectionToDatabase } from '../database';
import * as yup from 'yup';
import { hash } from 'bcrypt';
import { AppError } from '../errors/AppError';

class RegisterController {
  async create(req: Request, res: Response) {
    const { email, nickname, password } = req.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      nickname: yup.string().required(),
      password: yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const saltRounds = 10;

    const userData = {
      email,
      nickname,
      password: await hash(password, saltRounds),
      createdAt: new Date(),
    };

    const db = await connectionToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('users');

    const nicknameAlreadyExists = await collection.findOne({
      email: userData.email,
    });

    if (nicknameAlreadyExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    await collection.insertOne(userData);

    return res.status(201).json({
      message: 'user created successfully!',
      userData,
    });
  }
}

export { RegisterController };
