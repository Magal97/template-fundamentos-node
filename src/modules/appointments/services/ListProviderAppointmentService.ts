import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import RedisCacheProvider from '@shared/container/provider/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import { injectable, inject} from 'tsyringe';
import {getHours, isAfter} from 'date-fns';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
};

@injectable()
class ListProviderAppointmentService {

  constructor (
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: RedisCacheProvider,

    ){};

  public async execute({provider_id, month, year, day}: IRequest): Promise<Appointment[]> {
   const cachedKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`

   let appointments = await this.cacheProvider.recover<Appointment[]>(cachedKey);

    if(!appointments){
      appointments = await this.appointmentRepository.findAllInDayFromProvider({
        provider_id,
        month,
        year,
        day,
      });

      await this.cacheProvider.save(cachedKey, appointments)

    }


    return appointments;

  }
}

export default ListProviderAppointmentService;
