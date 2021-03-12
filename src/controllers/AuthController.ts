import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';

interface decodedData {
  id: string;
  iat: number;
  exp: number;
}

class AuthController {
  async execute(req: Request, res: Response) {
    const { authorization } = req.headers;

    const [, token] = authorization.split(' ');

    console.log(token);

    try {
      const decoded = verify(token, process.env.SECRET) as decodedData;

      const db = await connectionToDatabase(process.env.MONGODB_URI);

      const collection = db.collection('users');

      console.log(decoded.id);

      const user = await collection.findOne({ _id: new ObjectId(decoded.id) });

      return res.status(200).json({ user });
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export { AuthController };
