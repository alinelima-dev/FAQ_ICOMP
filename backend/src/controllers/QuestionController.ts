import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import { QuestionService } from "../services/QuestionService";

@injectable()
export class QuestionController {
  constructor(
    @inject(TYPES.QuestionService) private questionService: QuestionService
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content, category_id } = req.body;
      const files = req.files as Express.Multer.File[]; // múltiplos arquivos

      const question = await this.questionService.createQuestion(
        title,
        content,
        category_id,
        files
      );
      res.status(201).json(question);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const questions = await this.questionService.getAllQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const question = await this.questionService.getQuestionById(Number(id));
      if (!question) {
        res.status(404).json({ error: "Pergunta não encontrada" });
      } else {
        res.json(question);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, category_id } = req.body;
      const files = req.files as Express.Multer.File[];

      const updated = await this.questionService.updateQuestion(
        Number(id),
        title,
        content,
        category_id,
        files
      );

      if (!updated) {
        res.status(404).json({ error: "Pergunta não encontrada" });
      } else {
        res.json(updated);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.questionService.deleteQuestion(Number(id));
      if (!deleted) {
        res.status(404).json({ error: "Pergunta não encontrada" });
      } else {
        res.json({ message: "Pergunta deletada com sucesso" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
