import { getCustomRepository } from 'typeorm';
import CategoryRepository from '../repositories/CategoryRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getCustomRepository(CategoryRepository);
    const checkCategoryExistance = await categoryRepository.findOne({
      where: { title },
    });
    if (checkCategoryExistance) {
      throw new AppError('Category already Exists', 401);
    }
    const category = categoryRepository.create({ title });
    await categoryRepository.save(category);
    return category;
  }
}
export default CreateCategoryService;
