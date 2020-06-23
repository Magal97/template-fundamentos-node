import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import RedisCacheProvider from '@shared/container/provider/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationRepository';
import AppError from '../../../shared/errors/AppError';
import { ptBR } from 'date-fns/locale';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: RedisCacheProvider,
    ){};


  public async execute({ date, provider_id,  user_id}: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
      throw new AppError("You can't create an appointment out of the service time");
    }

    if(isBefore(appointmentDate, Date.now())){
      throw new AppError("You can't create an appointment on a past date");
    }

    if(user_id === provider_id){
      throw new AppError("You can't create an appointment with yourself")
    }

    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    const formatedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'", {locale: ptBR});

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento marcado para o dia ${formatedDate}`,
    })

    await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`);

    return appointment;

  }
}

export default CreateAppointmentService;
