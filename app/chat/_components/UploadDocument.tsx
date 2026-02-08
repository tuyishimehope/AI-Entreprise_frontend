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
    <Box className={styles.formModal}>
      <Paper elevation={24} className={styles.formContainer}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload Document</Typography>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit} className={styles.formInner}>
          <Box className={styles.fileDropzone}>
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.hiddenInput}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.fileLabel}>
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
