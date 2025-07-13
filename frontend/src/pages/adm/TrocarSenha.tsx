import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUserContext } from "@contexts/UserContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

const TrocarSenha: React.FC = () => {
  const { userService } = useUserContext();
  const { showSnackbar } = useSnackbar();
  const { usuario } = useAuth(); // pega o nome/email do usuário logado
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showSnackbar("As senhas não coincidem.", "warning");
      return;
    }

    if (!usuario) {
      showSnackbar("Usuário não identificado.", "error");
      return;
    }

    try {
      await userService.updatePassword({
        usuario,
        currentPassword,
        newPassword,
      });
      showSnackbar("Senha alterada com sucesso!", "success");
      navigate("/adm/perguntas");
    } catch (error) {
      showSnackbar("Erro ao alterar senha.", "error");
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
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: { xs: 3, sm: 5 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Alterar Senha
          </Typography>

          <TextField
            label="Senha atual"
            type={showPasswords.current ? "text" : "password"}
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    edge="end"
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Nova senha"
            type={showPasswords.new ? "text" : "password"}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    edge="end"
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar nova senha"
            type={showPasswords.confirm ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    edge="end"
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box mt={3}>
            <Button type="submit" variant="contained" fullWidth>
              Atualizar Senha
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TrocarSenha;
