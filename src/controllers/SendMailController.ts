import { Request, Response } from 'express';
import * as yup from 'yup';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';
import sendMailService from '../services/sendMailService';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email } = request.body;

    const schema = yup.object().shape({
      email: yup.string().email().required(),
    });

    try {
      schema.validate(request.body);
    } catch (err) {
      throw new AppError(err);
    }

    const db = await connectionToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('users');

    const user = await collection.findOne({ email });

    if (!user)
      return response.status(400).json({ message: 'Email not exists!' });

    const npsPath = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'templateMailForgotPassword.hbs'
    );

    const token = randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 3);

    await collection.findOneAndUpdate(
      { _id: user._id },

      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      }
    );

    const variables = {
      token,
      link: process.env.URL_RESET_PASSWORD,
    };

    const infoMessageSend = await sendMailService.execute(
      email,
      'Noreply',
      variables,
      npsPath
    );

    if (!infoMessageSend)
      return response
        .status(400)
        .json({ message: 'It was not possible to send the email' });

    return response.json({ message: 'Email enviado com sucesso!' });
  }
}

export { SendMailController };
