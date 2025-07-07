import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", //'dark' se quiser modo escuro
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
