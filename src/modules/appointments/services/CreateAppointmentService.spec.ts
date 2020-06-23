import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository:FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository,
    fakeNotificationRepository, fakeCacheProvider);

  });

  it('should be able to create a new appointment', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');

  });

  it('should not be able to create an appointment on the same date/hour', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11)
    await createAppointmentService.execute({
      date:appointmentDate,
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await expect(createAppointmentService.execute({
      date:appointmentDate,
      provider_id: 'provider_id',
      user_id: 'user_id',
    })).rejects.toBeInstanceOf(AppError)

  });

  it('should not be able to create an appointment on passed date', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: 'provider_id',
      user_id: 'user_id',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment with same user as provider', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider_id',
      user_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment outside the available time/hours', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
      date: new Date(2020, 4, 11, 7),
      provider_id: 'provider_id',
      user_id: 'user_id',
    })).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
      date: new Date(2020, 4, 11, 18),
      provider_id: 'provider_id',
      user_id: 'user_id',
    })).rejects.toBeInstanceOf(AppError);

  });

});
