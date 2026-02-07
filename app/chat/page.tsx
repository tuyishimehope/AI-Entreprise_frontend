"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import heroImage from "../../public/image.png";
import Session from "./_components/Session";
import UploadDocument from "./_components/UploadDocument";
import { SessionData } from "../types/Session.type";
import { api } from "../util/api";
import styles from "./page.module.css";

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

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      const response = await axios.delete(`${api}/session/${id}`);
      if (response.status === 200 || response.status === 204) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  return (
    <Box className={styles.main_layout}>
      <Stack className={styles.hero_section}>
        <Box className={styles.image_placeholder}>
          <Image src={heroImage} alt="RAG Illustration" priority />
        </Box>
      </Stack>

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
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Create New Session
          </Button>
        </Box>

        <Session
          sessions={sessions}
          handleDeleteSession={handleDeleteSession}
        />
      </Stack>

      {isModalOpen && (
        <UploadDocument
          file={file}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </Box>
  );
};

export default Page;
