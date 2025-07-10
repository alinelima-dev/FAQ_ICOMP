import { ICategory, IQuestion, ISuggestion } from "types/faqTypes";

export interface IFaqService {
  createQuestion(
    data: Partial<IQuestion> | FormData,
    isFormData?: boolean
  ): Promise<void>;
  getQuestions(): Promise<IQuestion[]>;
  updateQuestion(
    id: number,
    data: Partial<IQuestion> | FormData,
    isFormData?: boolean
  ): Promise<void>;
  deleteQuestion(id: number): Promise<void>;
  createCategory(data: Partial<ICategory>): Promise<void>;
  getCategories(): Promise<ICategory[]>;
  updateCategory(id: number, data: Partial<ICategory>): Promise<void>;
  deleteCategory(id: number): Promise<void>;
  getSuggestions(): Promise<ISuggestion[]>;
  submitSuggestion(data: Partial<ISuggestion>): Promise<void>;
  getQuestionById(id: number): Promise<IQuestion>;
  getCategoryById(id: number): Promise<ICategory>;
}
