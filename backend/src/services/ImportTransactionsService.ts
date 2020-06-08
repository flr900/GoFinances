import csvParse from 'csv-parse';
import fs from 'fs';
import { In, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/Upload';
import TransactionRepository from '../repositories/TranscationsRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import Category from '../models/Category';

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface filenameRequest {
  filename: string;
}

interface TransactionsParsed {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryType: string;
}

class ImportTransactionsService {
  async execute({ filename }: filenameRequest): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);
    const csvPath = `${uploadConfig.directory}/${filename}`;
    const readCSVStream = fs.createReadStream(csvPath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);
    const transactions: TransactionsParsed[] = [];
    const categories: string[] = [];
    parseCSV.on('data', line => {
      const [title, type, value, categoryType] = line.map((cell: string) =>
        cell.trim(),
      );
      if (!title || !type || !value || !categoryType) {
        return;
      }
      categories.push(categoryType);
      transactions.push({
        title,
        type,
        value,
        categoryType,
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const existentCategories = await categoryRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategories = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const insertedCategories = categoryRepository.create(
      addCategories.map(title => ({
        title,
      })),
    );

    await categoryRepository.save(insertedCategories);

    const categoriesJoined = [...existentCategories, ...insertedCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(item => ({
        title: item.title,
        type: item.type,
        value: item.value,
        category: categoriesJoined.find(
          categoryItem => categoryItem.title === item.categoryType,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);
    await fs.promises.unlink(csvPath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
