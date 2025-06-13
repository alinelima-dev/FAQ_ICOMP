import { inject, injectable } from "inversify";
import { IFaqService } from "./IFaqService";
import type { IHttpService } from "../modules/http/models/IHttpService";
import { Types } from "../ioc/types";
import { Category, Question, Suggestion } from "types/faqTypes";
@injectable()
export class FaqService implements IFaqService {
  constructor(
    @inject(Types.IHttpService)
    private readonly httpInstance: IHttpService
  ) {}

  public async createQuestion(data: Partial<Question>): Promise<void> {
    await this.httpInstance.post("/questions", data);
  }

  public async getQuestions(): Promise<Question[]> {
    return await this.httpInstance.get("/questions");
  }

  public async updateQuestion(
    id: number,
    data: Partial<Question>
  ): Promise<void> {
    await this.httpInstance.put(`/questions/${id}`, data);
  }

  public async deleteQuestion(id: number): Promise<void> {
    await this.httpInstance.delete(`/questions/${id}`);
  }

  public async createCategory(data: Partial<Category>): Promise<void> {
    await this.httpInstance.post("/categories", data);
  }

  public async getCategories(): Promise<Category[]> {
    return await this.httpInstance.get("/categories");
  }

  public async updateCategory(
    id: number,
    data: Partial<Category>
  ): Promise<void> {
    await this.httpInstance.put(`/categories/${id}`, data);
  }

  public async deleteCategory(id: number): Promise<void> {
    await this.httpInstance.delete(`/categories/${id}`);
  }

  public async getSuggestions(): Promise<Suggestion[]> {
    return await this.httpInstance.get("/faq/suggestions");
  }

  public async submitSuggestion(data: Partial<Suggestion>): Promise<void> {
    await this.httpInstance.post("/faq/suggestions", data);
  }
}
