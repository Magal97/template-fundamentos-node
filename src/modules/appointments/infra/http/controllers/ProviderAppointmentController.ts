import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentController {
  public async index (request: Request, response: Response): Promise<Response>{
    const provider_id = request.user.id;
    const { year, month, day } = request.query;

    const createAppointment = container.resolve(ListProviderAppointmentService);

    const appointments = await createAppointment.execute({
      provider_id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}
