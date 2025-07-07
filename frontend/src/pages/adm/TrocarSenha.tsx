import "./css/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Button, Input, Label, Alert } from "reactstrap";
import { useUserContext } from "@contexts/UserContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import bcrypt from "bcryptjs";

const TrocarSenha: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userService } = useUserContext();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const hashSalvo =
    "$2a$12$JH3XiRXT3s3x7Yv0KjIMYuxF.u4r35N3/u50xdUQLIURKKnLoPIvm"; // Hash fixo para teste

  const testarSenhaAtual = async () => {
    const confere = await bcrypt.compare(currentPassword, hashSalvo);
    if (confere) {
      showSnackbar("✅ A senha atual está correta!", "success");
    } else {
      showSnackbar("❌ A senha atual está incorreta.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showSnackbar("As senhas não coincidem.", "warning");
      return;
    }

    try {
      await userService.updatePassword({
        usuario,
        currentPassword,
        newPassword,
      });
      showSnackbar("Senha atualizada com sucesso.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      /*setTimeout(() => {
        navigate("/adm/perguntas");
      }, 2000);*/
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Erro ao atualizar a senha.";
      showSnackbar(msg, "error");
    }
  };

  return (
    <div className="login-container">
      <Form className="centered-form" onSubmit={handleSubmit}>
        <h2>Alterar Senha</h2>

        <FormGroup>
          <Label for="usuario">Usuário</Label>
          <Input
            id="usuario"
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="currentPassword">Senha atual</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Digite sua senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="newPassword">Nova senha</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Digite a nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="confirmPassword">Confirmar nova senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>

        <Button type="submit" color="primary">
          Atualizar Senha
        </Button>

        <Button
          type="button"
          color="secondary"
          onClick={testarSenhaAtual}
          style={{ marginBottom: "1rem" }}
        >
          Testar Senha Atual
        </Button>
      </Form>
    </div>
  );
};

export default TrocarSenha;
