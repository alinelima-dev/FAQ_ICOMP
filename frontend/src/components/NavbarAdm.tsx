import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import {
  FaBars,
  FaQuestionCircle,
  FaClipboardList,
  FaSignOutAlt,
  FaPen,
  FaComment,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GenericMessage } from "@locales/locale";

const NavbarAdm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isInPerguntas = location.pathname.includes("/adm/perguntas");
  const isInCategorias = location.pathname.includes("/adm/categorias");
  const isInSuggestion = location.pathname.includes("/adm/categorias");

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <>
      {/* AppBar superior */}
      <AppBar position="static" sx={{ backgroundColor: "#1e3a8a", px: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
            >
              <FaBars />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              FAQIcomp •{" "}
              <Box component="span" sx={{ color: "#ffd700", fontWeight: 400 }}>
                Admin
              </Box>
            </Typography>
          </Box>

          <Button
            color="error"
            startIcon={<FaSignOutAlt />}
            onClick={handleLogout}
          />
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ p: 2, fontWeight: 600, color: "#1e3a8a" }}
            >
              {GenericMessage.menuTitle}
            </Typography>
            <Divider />
            <List>
              {!isInPerguntas && (
                <ListItemButton onClick={() => navigate("/adm/perguntas")}>
                  <ListItemIcon>
                    <FaQuestionCircle />
                  </ListItemIcon>
                  <ListItemText primary="Perguntas" />
                </ListItemButton>
              )}

              {!isInCategorias && (
                <ListItemButton onClick={() => navigate("/adm/categorias")}>
                  <ListItemIcon>
                    <FaClipboardList />
                  </ListItemIcon>
                  <ListItemText primary="Categorias" />
                </ListItemButton>
              )}
              {!isInSuggestion && (
                <ListItemButton onClick={() => navigate("/adm/sugestoes")}>
                  <ListItemIcon>
                    <FaComment />
                  </ListItemIcon>
                  <ListItemText primary="Sugestões" />
                </ListItemButton>
              )}
              <ListItemButton onClick={() => navigate("/trocar-senha")}>
                <ListItemIcon>
                  <FaPen />
                </ListItemIcon>
                <ListItemText primary="Atualizar Senha" />
              </ListItemButton>
            </List>
          </Box>

          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              color="error"
              variant="contained"
              startIcon={<FaSignOutAlt />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavbarAdm;
