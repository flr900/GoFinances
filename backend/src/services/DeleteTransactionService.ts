import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TranscationsRepository';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactionDeleted = await transactionsRepository.delete(
      transactionId,
    );

    if (!transactionDeleted) {
      throw new AppError('Transaction was not deleted!');
    }
  }
}

export default DeleteTransactionService;
