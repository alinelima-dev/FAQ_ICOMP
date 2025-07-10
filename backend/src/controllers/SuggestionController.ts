import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import { SuggestionService } from "../services/SuggestionService";

@injectable()
export class SuggestionController {
  constructor(
    @inject(TYPES.SuggestionService)
    private suggestionService: SuggestionService
  ) {}

  create = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!title || !content) {
      res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
    }

    try {
      const suggestion = await this.suggestionService.createSuggestion(
        title,
        content,
        String(ip)
      );
      res.status(201).json(suggestion);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const suggestions = await this.suggestionService.getAllSuggestions();
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
