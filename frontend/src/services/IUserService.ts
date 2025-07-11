export interface IUserService {
  updatePassword(data: {
    usuario: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<void>;

  //usuário não logado solicitar o link de redefinição
  forgotPassword(email: string): Promise<void>;

  //redefinir a senha usando o token enviado por e-mail
  resetPassword(token: string, newPassword: string): Promise<void>;
}
