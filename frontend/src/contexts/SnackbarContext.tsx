import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar deve estar dentro de SnackbarProvider");
  return context;
};

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showSnackbar = (msg: string, sev: AlertColor = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          onClose={() => setOpen(false)}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
