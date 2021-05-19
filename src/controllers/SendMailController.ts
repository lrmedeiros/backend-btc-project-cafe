import { Request, Response } from 'express';
import * as yup from 'yup';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';

import { connectionToDatabase } from '../database';
import { AppError } from '../errors/AppError';
import sendMailService from '../services/sendMailService';
import errorMessages from '../const/errorMessages';
import sucessMessages from '../const/sucessMessages';

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
      return response.status(200).json({ message: sucessMessages.SEND_MAIL });

    const npsPath = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'templateMailForgotPassword.hbs'
    );

    const token = uuid();

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
        .status(500)
        .json({ message: errorMessages.ERROR_SEND_MAIL });

    return response.json({ message: infoMessageSend });
  }
}

export { SendMailController };
