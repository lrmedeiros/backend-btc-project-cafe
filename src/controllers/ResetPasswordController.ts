import { hash } from 'bcrypt';
import { Request, Response } from 'express';
import * as yup from 'yup';

import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';

class ResetPasswordController {
  async execute(request: Request, response: Response) {
    const { email, newPassword, token } = request.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      newPassword: yup.string().required(),
      token: yup.string().required(),
    });

    try {
      schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const db = await connectionToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('users');

    const user = await collection.findOne({ email });

    if (!user)
      return response.status(400).json({ message: 'User does not exist!' });

    if (user.passwordResetToken !== token)
      return response.status(400).json({ message: 'Invalid token!' });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return response.status(400).json({ message: 'link has expired!' });

    const saltRounds = 10;

    await collection.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: await hash(newPassword, saltRounds),
        },
      }
    );

    return response
      .status(200)
      .json({ message: 'The new password has been correctly established!' });
  }
}

export { ResetPasswordController };
