import { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useUserContext } from "@contexts/UserContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import bcrypt from "bcryptjs";
import { GenericMessage, SnackbarMessage } from "@locales/locale";

const TrocarSenha: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userService } = useUserContext();
  const { showSnackbar } = useSnackbar();

  // const hashSalvo =
  //   "$2a$12$JH3XiRXT3s3x7Yv0KjIMYuxF.u4r35N3/u50xdUQLIURKKnLoPIvm";

  // const testarSenhaAtual = async () => {
  //   const confere = await bcrypt.compare(currentPassword, hashSalvo);
  //   showSnackbar(
  //     confere
  //       ? "✅ A senha atual está correta!"
  //       : "❌ A senha atual está incorreta.",
  //     confere ? "success" : "error"
  //   );
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showSnackbar(SnackbarMessage.changePasswordNoMatch, "warning");
      return;
    }

    try {
      await userService.updatePassword({
        usuario,
        currentPassword,
        newPassword,
      });
      showSnackbar(SnackbarMessage.changePasswordSucess, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || SnackbarMessage.changePasswordError;
      showSnackbar(msg, "error");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(50deg, #2575fc, #6a11cb)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 15s ease infinite",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: { xs: 3, sm: 5 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 420,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            {GenericMessage.changePasswordTitle}
          </Typography>

          <TextField
            label="Usuário"
            fullWidth
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <TextField
            label="Senha atual"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <TextField
            label="Nova senha"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <TextField
            label="Confirmar nova senha"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <Button type="submit" variant="contained" fullWidth>
              Atualizar Senha
            </Button>
            {/* <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={testarSenhaAtual}
            >
              Testar Senha Atual
            </Button> */}
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TrocarSenha;
