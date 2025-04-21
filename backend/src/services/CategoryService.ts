import { inject, injectable } from 'inversify';
import TYPES from '../types';
import { CategoryRepository } from '../repositories/CategoryRepository';

@injectable()
export class CategoryService {
  constructor(
    @inject(TYPES.CategoryRepository) private categoryRepo: CategoryRepository
  ) {}

  createCategory(name: string) {
    return this.categoryRepo.create(name);
  }

  getAllCategories() {
    return this.categoryRepo.findAll();
  }

  getCategoryById(id: number) {
    return this.categoryRepo.findById(id);
  }

  updateCategory(id: number, name: string) {
    return this.categoryRepo.update(id, name);
  }

  deleteCategory(id: number) {
    return this.categoryRepo.delete(id);
  }
}
