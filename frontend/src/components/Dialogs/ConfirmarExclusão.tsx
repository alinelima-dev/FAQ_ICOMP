import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { GenericMessage } from "@locales/locale";

interface ConfirmarExclusaoDialogProps {
  open: boolean;
  itemDescricao: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmarExclusao: React.FC<ConfirmarExclusaoDialogProps> = ({
  open,
  itemDescricao,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{GenericMessage.confirmExcludMessage}</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir a pergunta
          <strong>{itemDescricao}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Sim, excluir
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmarExclusao;
