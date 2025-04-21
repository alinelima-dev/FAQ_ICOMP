import pool from '../config/db';

export class UserService {
  async findUserByUsername(username: string) {
    const query = 'SELECT * FROM usuarios WHERE usuario = $1'; // Ajuste a consulta conforme o seu banco de dados
    const result = await pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0]; // retorna o primeiro usuário encontrado
  }
}
