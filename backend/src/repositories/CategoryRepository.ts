import { Repository, EntityRepository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async findOneOrUpdate(categoryType: string): Promise<Category> {
    const findCategory = await this.findOne({
      where: { title: categoryType },
    });

    if (!findCategory) {
      const category = this.create({ title: categoryType });
      await this.save(category);
      return category;
    }
    return findCategory;
  }
}

export default CategoryRepository;
