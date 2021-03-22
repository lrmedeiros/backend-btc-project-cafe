import { hash } from 'bcrypt';
import { Request, Response } from 'express';
import * as yup from 'yup';
import errorMessages from '../const/errorMessages';
import sucessMessages from '../const/sucessMessages';

import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';

class ResetPasswordController {
  async execute(request: Request, response: Response) {
    const { newPassword, token } = request.body;

    const schema = yup.object().shape({
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

    const user = await collection.findOne({ passwordResetToken: token });

    if (!user)
      return response
        .status(400)
        .json({ message: errorMessages.INVALID_TOKEN });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return response.status(400).json({ message: errorMessages.LINK_EXPIRED });

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
      .json({ message: sucessMessages.PASSWORD_CHANGE });
  }
}

export { ResetPasswordController };
