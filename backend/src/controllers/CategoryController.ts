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
      if (!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({
          success: false,
          message: "O nome da categoria é obrigatório.",
        });
        return;
      }
      const category = await this.categoryService.createCategory(name);
      res.status(201).json({
        success: true,
        message: "Categoria criada com sucesso!",
        category: category,
      });
    } catch (error: any) {
      if (error.code === "23505") {
        res.status(409).json({
          success: false,
          message: `A categoria '${req.body.name}' já existe. Por favor, escolha outro nome.`,
        });
      } else {
        console.error("Erro inesperado ao criar categoria:", error);
        res.status(500).json({
          success: false,
          message: "Ocorreu um erro ao criar a categoria.",
        });
      }
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
      if (!updated) {
        res.status(404).json({ error: "Categoria não encontrada" });
      } else {
        res.json(updated);
      }
    } catch (error: any) {
      if (error.code === "23505") {
        res.status(409).json({
          success: false,
          message: `A categoria '${req.body.name}' já existe. Por favor, escolha outro nome.`,
        });
      } else {
        console.error(
          `Erro ao atualizar categoria com ID ${req.params.id}:`,
          error
        );
        res.status(500).json({ error: error.message });
      }
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.categoryService.deleteCategory(Number(id));
      res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message ===
        "Não é possível excluir esta categoria porque ela possui perguntas associadas."
      ) {
        res.status(409).json({ error: error.message });
      } else {
        res
          .status(500)
          .json({ error: "Erro interno do servidor ao deletar categoria" });
      }
    }
  };
}
