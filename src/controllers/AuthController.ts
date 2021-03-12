import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';

interface decodedData {
  _id: string;
  iat: number;
  exp: number;
}

class AuthController {
  async execute(req: Request, res: Response) {
    const { authorization } = req.headers;

    const [, token] = authorization.split(' ');

    try {
      const decoded = verify(token, process.env.SECRET) as decodedData;

      const db = await connectionToDatabase(process.env.MONGODB_URI);

      const collection = db.collection('users');

      const user = await collection.findOne({ _id: new ObjectId(decoded._id) });

      const userReturn = {
        nickname: user.nickname,
        email: user.email,
      };

      return res.status(200).json({ userReturn });
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export { AuthController };
