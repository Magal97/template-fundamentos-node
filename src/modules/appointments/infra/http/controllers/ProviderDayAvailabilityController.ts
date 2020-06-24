import {Request, Response} from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index (request: Request, response: Response): Promise<Response>{

    const { provider_id } = request.params;
    const { month, year, day } = request.query;

    const listProviders = container.resolve(ListProviderDayAvailabilityService);

    const availability = await listProviders.execute({
      provider_id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    return response.json(availability);
  }
}
