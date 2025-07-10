import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "../types";

import { CategoryService } from "../services/CategoryService";
import { QuestionService } from "../services/QuestionService";
import { AuthService } from "../services/AuthService";

import { CategoryRepository } from "../repositories/CategoryRepository";
import { QuestionRepository } from "../repositories/QuestionRepository";

import { CategoryController } from "../controllers/CategoryController";
import { QuestionController } from "../controllers/QuestionController";

import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";

import { AuthController } from "../controllers/AuthController";
import { SuggestionRepository } from "../repositories/SuggestionRepository";
import { SuggestionService } from "../services/SuggestionService";
import { SuggestionController } from "../controllers/SuggestionController";

const container = new Container();

container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<QuestionService>(TYPES.QuestionService).to(QuestionService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);

container
  .bind<CategoryRepository>(TYPES.CategoryRepository)
  .to(CategoryRepository);
container
  .bind<QuestionRepository>(TYPES.QuestionRepository)
  .to(QuestionRepository);

container.bind<CategoryController>(CategoryController).toSelf();
container.bind<QuestionController>(QuestionController).toSelf();
container.bind<AuthController>(AuthController).toSelf();

container.bind<UserController>(UserController).toSelf();
container.bind<UserService>(TYPES.UserService).to(UserService);

container
  .bind<SuggestionRepository>(TYPES.SuggestionRepository)
  .to(SuggestionRepository);
container
  .bind<SuggestionService>(TYPES.SuggestionService)
  .to(SuggestionService);
container.bind<SuggestionController>(SuggestionController).toSelf();

export default container;
