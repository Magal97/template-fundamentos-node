import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ id, title, value, type }: Transaction): Transaction {
    const transaction = this.transactionsRepository.create({
      id,
      title,
      value,
      type,
    });

    const { outcome, total } = this.transactionsRepository.getBalance();
    if (type === 'outcome' && outcome > total) {
      this.transactionsRepository.deleteTransactionWrongBalance(id);
      throw Error('Invalid balance');
    }

    return transaction;
  }
}

export default CreateTransactionService;
