import { inject, injectable } from "inversify";
import TYPES from "../types";
import { SuggestionRepository } from "../repositories/SuggestionRepository";

@injectable()
export class SuggestionService {
  constructor(
    @inject(TYPES.SuggestionRepository)
    private suggestionRepo: SuggestionRepository
  ) {}

  createSuggestion(
    title: string,
    content: string,
    email?: string,
    ip?: string
  ) {
    return this.suggestionRepo.create(title, content, email, ip);
  }

  getAllSuggestions() {
    return this.suggestionRepo.findAll();
  }
}
