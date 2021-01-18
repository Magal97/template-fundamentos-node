import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import '@shared/container';
import 'express-async-errors';
import cors from 'cors';
import uploadConfig from '@config/upload';
import { errors } from 'celebrate';
import routes from './routes';
import AppError from '../../errors/AppError';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);
    return response.status(500).json({
      status: 'error',
      message: err.message,
    });
  },
);

export default app;
