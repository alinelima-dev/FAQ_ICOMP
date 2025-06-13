import React from "react";
import ReactDOM from "react-dom/client";
import "reflect-metadata";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { FaqServiceProvider } from "@contexts/FaqServiceContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FaqServiceProvider>
          <App />
        </FaqServiceProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
