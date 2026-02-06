"use client";

import {
  Typography,
  Button,
  Stack,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import styles from "./page.module.css";
import heroImage from "../../public/image.png";
import { api } from "../util/api";
import axios from "axios";

type SessionData = {
  id: string;
  document_id: string;
  title: string;
  created_at: string;
};

const Page = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionData[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (!file) return;
    const response = await axios.post(`${api}/session`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    if (response.status == 200) {
      setSessions((prev) => [...prev, response.data]);
      router.push(`/chat/${response.data.id}`);
    }

    setIsModalOpen(false);
    setFile(null);
  };

  useEffect(() => {
    const loadSessions = async () => {
      const res = await axios.get(`${api}/session`);
      setSessions(res.data);
    };

    loadSessions();
  }, []);

  return (
    <Box className={styles.main_layout}>
      {/* Left Column: Hero / Visuals */}
      <Stack className={styles.hero_section}>
        <Box className={styles.image_placeholder}>
          <Image src={heroImage} alt="RAG Illustration" priority />
        </Box>
      </Stack>

      {/* Right Column: Content */}
      <Stack spacing={4} className={styles.content_section}>
        <Box>
          <Typography variant="h3" fontWeight="800">
            ENTERPRISE RAG
          </Typography>
          <Typography variant="h5" color="var(--text-muted)" sx={{ mb: 3 }}>
            Chat with your documents intelligently.
          </Typography>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="contained"
            size="large"
            // startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Create New Session
          </Button>
        </Box>

        <Box className={styles.session_list_container}>
          <Typography
            variant="h6"
            sx={{ borderBottom: "1px solid var(--border-subtle)", pb: 1 }}
          >
            Recent Sessions
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {sessions.length === 0 ? (
              <Typography color="var(--text-muted)">
                No sessions yet. Start by uploading a file.
              </Typography>
            ) : (
              sessions.map((session) => (
                <Paper
                  key={session.id}
                  className={styles.session_card}
                  onClick={() => router.push(`/chat/${session.id}`)}
                >
                  <Typography variant="body1" fontWeight="600">
                    {session.title}
                  </Typography>
                  <Typography variant="caption">
                    {new Date(session.created_at).toLocaleDateString()}
                  </Typography>
                </Paper>
              ))
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Overlay Modal */}
      {isModalOpen && (
        <Box className={styles.form_modal}>
          <Paper elevation={24} className={styles.form_container}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
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

              <Button
                type="submit"
                variant="contained"
                disabled={!file}
                fullWidth
              >
                Upload and Analyze
              </Button>
            </form>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Page;
