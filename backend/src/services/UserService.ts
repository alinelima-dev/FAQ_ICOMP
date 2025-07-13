import pool from "../config/db";
import bcrypt from "bcrypt";

export class UserService {
  async findUserByUsername(username: string) {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0]; //retorna o primeiro usuário encontrado
  }

  async updatePassword(
    username: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.senha);
    if (!passwordMatch) {
      throw new Error("Senha atual incorreta.");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.senha);
    if (isSamePassword) {
      throw new Error("A nova senha deve ser diferente da atual.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = "UPDATE usuarios SET senha = $1 WHERE email = $2";
    await pool.query(updateQuery, [hashedPassword, username]);
  }
}
