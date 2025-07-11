import { useEffect, useState } from "react";
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
//import bcrypt from "bcryptjs";
import { useLocation, useNavigate } from "react-router-dom";

const RedefinirSenha: React.FC = () => {
  const { userService } = useUserContext();
  const { showSnackbar } = useSnackbar();
  //const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      showSnackbar("Token de redefinição ausente.", "error");
      navigate("/login");
    }
  }, [location.search, showSnackbar, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showSnackbar("As senhas não coincidem.", "warning");
      return;
    }

    try {
      await userService.resetPassword(token, newPassword);
      showSnackbar("Senha redefinida com sucesso!", "success");
      navigate("/login");
    } catch (error) {
      showSnackbar("Erro ao redefinir senha.", "error");
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
          maxWidth: 400,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Redefinir senha
          </Typography>

          <TextField
            label="Nova senha"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar nova senha"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

export default RedefinirSenha;
