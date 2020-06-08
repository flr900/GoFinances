import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import CategoryRepository from '../repositories/CategoryRepository';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();

categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;
  const createCategoryService = new CreateCategoryService();
  const category = await createCategoryService.execute({ title });
  response.json(category);
});

categoriesRouter.get('/', async (request, response) => {
  const categoryRepository = getCustomRepository(CategoryRepository);

  const categories = await categoryRepository.find(
  );

  response.json(categories);
});

export default categoriesRouter;
