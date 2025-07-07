import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../types";
import { AuthService } from "../services/AuthService";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, senha } = req.body;
      console.log("Credenciais recebidas:", { usuario, senha });

      //AuthService para validar as credenciais e gerar o token
      const token = await this.authService.login(usuario, senha);

      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: "Credenciais inválidas" });
      }
    } catch (error: any) {
      console.error("Erro ao tentar fazer login:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
}
