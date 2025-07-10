import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Link as MuiLink,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IAttachment } from "types/faqTypes";

interface Props {
  attachments: IAttachment[];
  onDelete?: (id: number) => void;
}

const AttachmentList: React.FC<Props> = ({ attachments, onDelete }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Anexos existentes
      </Typography>
      <Paper variant="outlined">
        <List dense>
          {attachments.map((file) => {
            const filePath = file.filepath.includes("uploads\\")
              ? file.filepath.split("uploads\\")[1]
              : file.filepath.split("uploads/")[1];

            return (
              <ListItem key={file.id} divider>
                <ListItemText
                  primary={
                    <MuiLink
                      href={`http://localhost:3002/api/attachments/${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {file.filename}
                    </MuiLink>
                  }
                />
                {onDelete && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="remover anexo"
                      onClick={() => onDelete(file.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default AttachmentList;
