import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { AppError } from './errors/AppError';
import { router } from './routes';
import errorMessages from './const/errorMessages';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        ErrorMessage: err.message,
      });
    }

    return response.status(500).json({
      status: 'Error',
      ErrorMessage: `${errorMessages.INTERNAL_ERROR} ${err.message}`,
    });
  }
);

export { app };
