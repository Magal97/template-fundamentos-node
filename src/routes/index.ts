import { Router } from 'express';
import transactionRouter from './transaction.routes';
import appointmentRouter from './appointments.routes';
import sessionsRouter from './sessions.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/transactions', transactionRouter);
routes.use('/appointments', appointmentRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);

export default routes;
