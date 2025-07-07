export interface IUserService {
  updatePassword(data: {
    usuario: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<void>;
}
