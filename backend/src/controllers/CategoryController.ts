import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import { CategoryService } from "../services/CategoryService";

@injectable()
export class CategoryController {
  constructor(
    @inject(TYPES.CategoryService) private categoryService: CategoryService
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const category = await this.categoryService.createCategory(name);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(Number(id));
      if (!category) {
        res.status(404).json({ error: "Categoria não encontrada" });
      } else {
        res.json(category);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updated = await this.categoryService.updateCategory(
        Number(id),
        name
      );
      if (!updated){
        res.status(404).json({ error: "Categoria não encontrada" });}
    else {res.json(updated);}
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.categoryService.deleteCategory(Number(id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
