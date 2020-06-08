import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/Upload';
import TransactionsRepository from '../repositories/TranscationsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();
  const { title, value, type, category } = request.body;
  /* if (!isUuid(category_id)) {
    response.status(400).json({ message: 'ID not valid' });
  } */
  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    categoryType: category,
  });
  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id: transactionId } = request.params;

  const transactionsRepository = new DeleteTransactionService();

  await transactionsRepository.execute(transactionId);

  response.json({ message: 'Deleted' });
});

transactionsRouter.post(
  '/import',
  upload.single('csvFile'),
  async (request, response) => {
    const { filename } = request.file;
    const importTransactionsService = new ImportTransactionsService();
    const importedTransactions = await importTransactionsService.execute({
      filename,
    });
    console.log(importedTransactions);
    return response.json({ importedTransactions });
  },
);

export default transactionsRouter;
