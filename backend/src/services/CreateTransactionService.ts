// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TranscationsRepository';

import CategoryRepository from '../repositories/CategoryRepository';
import AppError from '../errors/AppError';
// import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryType: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryType,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Not enough cash!');
    }

    const category = await categoryRepository.findOneOrUpdate(categoryType);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
