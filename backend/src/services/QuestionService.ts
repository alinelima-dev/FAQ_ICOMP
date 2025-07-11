import { inject, injectable } from "inversify";
import TYPES from "../types";
import { QuestionRepository } from "../repositories/QuestionRepository";

@injectable()
export class QuestionService {
  constructor(
    @inject(TYPES.QuestionRepository) private questionRepo: QuestionRepository
  ) {}

  createQuestion(
    title: string,
    content: string,
    categoryIds: number[],
    files?: Express.Multer.File[]
  ) {
    return this.questionRepo.create(title, content, categoryIds, files);
  }

  getAllQuestions() {
    return this.questionRepo.findAll();
  }

  getQuestionById(id: number) {
    return this.questionRepo.findById(id);
  }

  updateQuestion(
    id: number,
    title: string,
    content: string,
    categoryIds: number[],
    files?: Express.Multer.File[]
  ) {
    return this.questionRepo.update(id, title, content, categoryIds, files);
  }

  deleteQuestion(id: number) {
    return this.questionRepo.delete(id);
  }
}
