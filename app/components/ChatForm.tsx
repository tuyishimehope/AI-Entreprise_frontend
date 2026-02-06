import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import styles from "./ChatForm.module.css";

interface ChatFormProps {
  setFile: Dispatch<SetStateAction<File | null>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  query: string | null | undefined;
  setQuery: Dispatch<SetStateAction<string>>;
  file: File | null | undefined;
}

const ChatForm = ({
  handleSubmit,
  isLoading,
  query,
  setFile,
  setQuery,
  file,
}: ChatFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => setFile(null);

  return (
    <Box className={styles.form_wrapper}>
      {/* File Preview Chip - Floating above the input */}
      {file && (
        <Box className={styles.file_preview}>
          <span>{file.name}</span>
          <IconButton size="small" onClick={clearFile}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <form className={styles.form_container} onSubmit={handleSubmit}>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
        />

        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={query || ""}
          onChange={handleQueryChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (query?.trim() && !isLoading) handleSubmit(e);
            }
          }}
          placeholder="Ask about Harvest data..."
          disabled={isLoading}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              paddingRight: "8px",
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Upload Source">
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={isLoading || !query?.trim()}
                >
                  {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  );
};

export default ChatForm;
