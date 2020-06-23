import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it('should generate a forgot password token', async () => {


    const user = await fakeUserRepository.create({
      name: 'Joe',
      email: 'joe@outlook.com',
      password: '1234',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '2323',
      token: userToken.token,
    });

    const userUpdate = await fakeUserRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('2323')
    expect(userUpdate?.password).toBe('2323');

  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
      password: '2323',
      token: 'non-existing-token',
    })).rejects.toBeInstanceOf(AppError);

  });


  it('should not be able to reset the password with non-existing user', async () => {

    const { token } = await fakeUserTokensRepository.generate('non-existing-user');

    await expect(
      resetPasswordService.execute({
      password: '2323',
      token,
    })).rejects.toBeInstanceOf(AppError);

  });


  it('should not be able to reset the password if it has passed more than 2 hours', async () => {


    const user = await fakeUserRepository.create({
      name: 'Joe',
      email: 'joe@outlook.com',
      password: '1234',
    });

    const {token} = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '12345',
        token,
      })
    ).rejects.toBeInstanceOf(AppError);

  });

});
