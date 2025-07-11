import { Request, Response } from "express";
import { PasswordResetService } from "../services/ResetPassWordService";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import EmailService from "../services/EmailService";

@injectable()
export class PasswordResetController {
  constructor(
    @inject(TYPES.PasswordResetService) private service: PasswordResetService
  ) {}

  requestReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const token = await this.service.generateResetToken(email);

    if (!token) {
      res.status(404).json({ message: "E-mail não encontrado." });
      return;
    }

    // Enviar e-mail com o link contendo o token
    const resetUrl = `http://localhost:5173/redefinir-senha?token=${token}`;
    console.log("Link de redefinição:", resetUrl); // Aqui você usaria um serviço de e-mail real
    try {
      await EmailService.sendResetPasswordEmail(email, resetUrl);
      res.json({
        message: "E-mail de recuperação enviado, se o e-mail existir.",
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      res.status(500).json({ message: "Erro ao enviar e-mail." });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, novaSenha } = req.body;
    const sucesso = await this.service.resetPassword(token, novaSenha);

    if (sucesso) {
      res.json({ message: "Senha redefinida com sucesso!" });
    } else {
      res.status(400).json({ message: "Token inválido ou expirado." });
    }
  };
}
