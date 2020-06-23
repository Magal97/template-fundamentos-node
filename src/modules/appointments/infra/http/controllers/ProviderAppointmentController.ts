import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';

export default class ProviderAppointmentController {
  public async index (request: Request, response: Response): Promise<Response>{
    const provider_id = request.user.id;
    const { year, month, day } = request.body;

    const createAppointment = container.resolve(ListProviderAppointmentService);

    const appointments = await createAppointment.execute({
      provider_id,
      year,
      month,
      day,
    });

    return response.json(appointments);
  }
}
