import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/provider/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotEmailPassword: SendForgotPasswordEmailService;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotEmailPassword = new SendForgotPasswordEmailService(fakeUserRepository, fakeMailProvider
    , fakeUserTokensRepository);
  })

  it('should be able to recover the password using email', async () => {


    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Joe',
      email: 'joe@outlook.com',
      password: '1234',
    })


    const user = await sendForgotEmailPassword.execute({
      email: 'joe@outlook.com',
    });

    expect(sendMail).toHaveBeenCalled();


  });

  it('should not be able to recover a non-existent user password', async () => {

    await expect(sendForgotEmailPassword.execute({
      email: 'joe@outlook.com',
    }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'Joe',
      email: 'joe@outlook.com',
      password: '1234',
    })

    await sendForgotEmailPassword.execute({
      email: 'joe@outlook.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);

  });

});
