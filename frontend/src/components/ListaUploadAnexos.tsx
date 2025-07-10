import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  files: File[];
  onRemove: (index: number) => void;
}

const AttachmentUploadList: React.FC<Props> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <Box mt={3}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="h6">Anexos selecionados</Typography>
        <Typography variant="body2" color="text.secondary">
          {files.length} arquivo(s) selecionado(s)
        </Typography>
      </Box>

      <Paper variant="outlined">
        <List dense>
          {files.map((file, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={file.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label={`remover ${file.name}`}
                  onClick={() => onRemove(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AttachmentUploadList;
