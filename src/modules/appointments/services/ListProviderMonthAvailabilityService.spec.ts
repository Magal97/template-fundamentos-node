import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailability from './ListProviderMonthAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderService: ListProviderMonthAvailability;

describe('ListProviderMonthAvailability', () => {
 beforeEach(() => {

  fakeAppointmentRepository = new FakeAppointmentRepository();
  listProviderService = new ListProviderMonthAvailability(fakeAppointmentRepository);

 });

 it('should be able to list the month availability from provider', async() =>{
    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 21, 17, 0, 0),
    });

    const availability = await listProviderService.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
    });

    await expect(availability).toEqual(expect.arrayContaining([
      {day: 19, availability: true},
      {day: 20, availability: false},
      {day: 21, availability: true},
      {day: 22, availability: true},
    ]),);

 });

})
