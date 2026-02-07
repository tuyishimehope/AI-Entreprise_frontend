import { Box, Paper, Typography, IconButton, Button } from "@mui/material";
import styles from "./UploadDocument.module.css";
import CloseIcon from "@mui/icons-material/Close";

interface UploadDocumentProps {
  file: File | null;
  setIsModalOpen: (toggle: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadDocument = ({
  file,
  setIsModalOpen,
  handleSubmit,
  handleFileChange,
}: UploadDocumentProps) => {
  return (
    <Box className={styles.form_modal}>
      <Paper elevation={24} className={styles.form_container}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload Document</Typography>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit} className={styles.form_inner}>
          <Box className={styles.file_dropzone}>
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.hidden_input}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.file_label}>
              {file ? file.name : "Click to select a PDF"}
            </label>
          </Box>

          <Button type="submit" variant="contained" disabled={!file} fullWidth>
            Upload and Analyze
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UploadDocument;
