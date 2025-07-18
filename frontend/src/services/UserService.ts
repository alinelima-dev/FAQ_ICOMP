import { injectable, inject } from "inversify";
import { IUserService } from "./IUserService";
import { Types } from "../ioc/types";
import type { IHttpService } from "../modules/http/models/IHttpService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Types.IHttpService)
    private readonly http: IHttpService
  ) {}
  async forgotPassword(email: string): Promise<void> {
    await this.http.post("/auth/request-reset", { email });
  }
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.http.post("/auth/reset-password", {
      token,
      novaSenha: newPassword,
    });
  }

  async updatePassword(data: {
    usuario: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.http.post("/adm/update-password", data);
  }
}
