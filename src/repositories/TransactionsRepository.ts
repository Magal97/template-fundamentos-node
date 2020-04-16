import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public deleteTransactionWrongBalance(id: string) {
    const repositoryIndex = this.transactions.findIndex(tran => tran.id === id);
    this.transactions.splice(repositoryIndex, 1);
  }

  public getBalance(): Balance {
    const income = this.transactions
      .map(transaction =>
        transaction.type === 'income' ? transaction.value : 0,
      )
      .reduce((total, currentValue) => total + currentValue, 0);

    const outcome = this.transactions
      .map(transaction =>
        transaction.type === 'outcome' ? transaction.value : 0,
      )
      .reduce((total, currentValue) => total + currentValue, 0);

    const total = income - outcome;
    return { total, income, outcome };
  }

  public create({ title, value, type }: Transaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
