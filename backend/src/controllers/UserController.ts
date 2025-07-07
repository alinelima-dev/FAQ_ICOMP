import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import { UserService } from "../services/UserService";

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  updatePassword = async (req: Request, res: Response) => {
    try {
      const { usuario } = req.body;
      const { currentPassword, newPassword } = req.body;

      await this.userService.updatePassword(
        usuario,
        currentPassword,
        newPassword
      );

      res.status(200).json({ message: "Senha atualizada com sucesso." });
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
}
