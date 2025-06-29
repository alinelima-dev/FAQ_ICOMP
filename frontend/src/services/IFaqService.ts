import { Category, Question, Suggestion } from "types/faqTypes";

export interface IFaqService {
  createQuestion(data: Partial<Question>): Promise<void>;
  getQuestions(): Promise<Question[]>;
  updateQuestion(id: number, data: Partial<Question>): Promise<void>;
  deleteQuestion(id: number): Promise<void>;
  createCategory(data: Partial<Category>): Promise<void>;
  getCategories(): Promise<Category[]>;
  updateCategory(id: number, data: Partial<Category>): Promise<void>;
  deleteCategory(id: number): Promise<void>;
  getSuggestions(): Promise<Suggestion[]>;
  submitSuggestion(data: Partial<Suggestion>): Promise<void>;
  getQuestionById(id: number): Promise<Question>;
  getCategoryById(id: number): Promise<Category>;
}
