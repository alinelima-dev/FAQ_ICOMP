import { Container } from "inversify";
import { Types } from "./types";

import AxiosHttpService from "../modules/http/implementations/AxiosHttpService";
import { IHttpService } from "../modules/http/models/IHttpService";

import { IFaqService } from "../services/IFaqService";
import { FaqService } from "../services/FaqService";
import { IUserService } from "../services/IUserService";
import { UserService } from "../services/UserService";

const appIocContainer = new Container({ defaultScope: "Singleton" });

function registerNewService<T>(
  type: string | symbol,
  constructor: new (...args: any[]) => T
) {
  appIocContainer.bind<T>(type).to(constructor);
}

registerNewService<IHttpService>(Types.IHttpService, AxiosHttpService);
registerNewService<IFaqService>(Types.Faq.IFaqService, FaqService);
registerNewService<IUserService>(Types.User.IUserService, UserService);

export { appIocContainer };
