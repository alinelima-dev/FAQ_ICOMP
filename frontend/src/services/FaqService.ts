import { inject, injectable } from "inversify";
import { IFaqService } from "./IFaqService";
import type { IHttpService } from "../modules/http/models/IHttpService";
import { Types } from "../ioc/types";
import { ICategory, IQuestion, ISuggestion } from "types/faqTypes";
@injectable()
export class FaqService implements IFaqService {
  constructor(
    @inject(Types.IHttpService)
    private readonly httpInstance: IHttpService
  ) {}

  public async createQuestion(
    data: Partial<IQuestion> | FormData,
    isFormData = false
  ): Promise<void> {
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    await this.httpInstance.post("/questions", data, { headers });
  }

  public async getQuestions(): Promise<IQuestion[]> {
    const response = await this.httpInstance.get("/questions");
    console.log("Resposta completa da API getQuestions:", response);
    return response;
  }

  public async updateQuestion(
    id: number,
    data: Partial<IQuestion> | FormData,
    isFormData = false
  ): Promise<void> {
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    await this.httpInstance.put(`/questions/${id}`, data, { headers });
  }

  public async deleteQuestion(id: number): Promise<void> {
    await this.httpInstance.delete(`/questions/${id}`);
  }

  public async getQuestionById(id: number): Promise<IQuestion> {
    return await this.httpInstance.get(`/questions/${id}`);
  }

  public async getCategoryById(id: number): Promise<ICategory> {
    return await this.httpInstance.get(`/categories/${id}`);
  }

  public async createCategory(data: Partial<ICategory>): Promise<void> {
    await this.httpInstance.post("/categories", data);
  }

  public async getCategories(): Promise<ICategory[]> {
    return await this.httpInstance.get("/categories");
  }

  public async updateCategory(
    id: number,
    data: Partial<ICategory>
  ): Promise<void> {
    await this.httpInstance.put(`/categories/${id}`, data);
  }

  public async deleteCategory(id: number): Promise<void> {
    await this.httpInstance.delete(`/categories/${id}`);
  }

  public async getSuggestions(): Promise<ISuggestion[]> {
    return await this.httpInstance.get("/suggestions");
  }

  public async submitSuggestion(data: Partial<ISuggestion>): Promise<void> {
    await this.httpInstance.post("/suggestions", data);
  }

  public async forgotPassword(email: string): Promise<void> {
    await this.httpInstance.post("/auth/request-reset", { email });
  }
}
