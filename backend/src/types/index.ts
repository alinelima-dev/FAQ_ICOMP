import { SuggestionRepository } from "../repositories/SuggestionRepository";

const TYPES = {
  CategoryService: Symbol.for("CategoryService"),
  QuestionService: Symbol.for("QuestionService"),
  SuggestionService: Symbol.for("SuggestionService"),
  AuthService: Symbol.for("AuthService"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  QuestionRepository: Symbol.for("QuestionRepository"),
  SuggestionRepository: Symbol.for("SuggestionRepository"),
  AuthController: Symbol.for("AuthController"),
  CategoryController: Symbol.for("CategoryController"),
  QuestionController: Symbol.for("QuestionController"),
  SuggestionController: Symbol.for("SuggestionController"),
  UserService: Symbol.for("UserService"),
  PasswordResetService: Symbol.for("PasswordResetService"),
  PasswordResetController: Symbol.for("PasswordResetController"),
  EmailService: Symbol.for("EmailService"),
};

export default TYPES;
