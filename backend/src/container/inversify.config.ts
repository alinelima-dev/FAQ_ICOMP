import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from '../types';

import { CategoryService } from '../services/CategoryService';
import { QuestionService } from '../services/QuestionService';
import { AuthService } from '../services/AuthService';

import { CategoryRepository } from '../repositories/CategoryRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';

import { CategoryController } from '../controllers/CategoryController';
import { QuestionController } from '../controllers/QuestionController';
import { AuthController } from '../controllers/AuthController';

const container = new Container();

// Registrando os services
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<QuestionService>(TYPES.QuestionService).to(QuestionService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);

// Registrando os repositories
container.bind<CategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository);
container.bind<QuestionRepository>(TYPES.QuestionRepository).to(QuestionRepository);

// Registrando os controllers
container.bind<CategoryController>(CategoryController).toSelf();
container.bind<QuestionController>(QuestionController).toSelf();
container.bind<AuthController>(AuthController).toSelf();


export default container;
