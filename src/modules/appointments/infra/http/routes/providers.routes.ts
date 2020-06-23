import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providerController = new ProvidersController();
const providerProviderMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerProviderDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticate);

providersRouter.get('/',  providerController.index);

providersRouter.get('/:provider_id/month-availability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required(),
  },
}),  providerProviderMonthAvailabilityController.index);

providersRouter.get('/:provider_id/day-availability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required(),
  },
}), providerProviderDayAvailabilityController.index);

export default providersRouter;
