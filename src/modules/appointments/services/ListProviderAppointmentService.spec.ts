import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentService from './ListProviderAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderService: ListProviderAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointment', () => {
 beforeEach(() => {

  fakeAppointmentRepository = new FakeAppointmentRepository();
  fakeCacheProvider = new FakeCacheProvider();
  listProviderService = new ListProviderAppointmentService(fakeAppointmentRepository, fakeCacheProvider);

 });

 it('should be able to list the appointment on a specific day', async() =>{
    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderService.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);

 });

})
