import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderDayAvailability from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderService: ListProviderDayAvailability;

describe('ListProviderDayAvailability', () => {
 beforeEach(() => {

  fakeAppointmentRepository = new FakeAppointmentRepository();
  listProviderService = new ListProviderDayAvailability(fakeAppointmentRepository);

 });

 it('should be able to list the day availability from provider', async() =>{
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

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });


    const availability = await listProviderService.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(expect.arrayContaining([
      {hour: 8, availability: false},
      {hour: 9, availability: false},
      {hour: 10, availability: false},
      {hour: 11, availability: false},
      {hour: 12, availability: true},
      {hour: 13, availability: true},
      {hour: 14, availability: false},
      {hour: 15, availability: false},
      {hour: 16, availability: true},
      {hour: 17, availability: true},
    ]));

 });

})
