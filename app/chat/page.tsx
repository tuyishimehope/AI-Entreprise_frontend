"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import heroImage from "../../public/image.png";
import { selectSessions } from "../lib/features/Sessions/SessionsSelectors";
import {
  deleteSession,
  fetchSessions,
  startSession,
} from "../lib/features/Sessions/SessionsThunks";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import Session from "./_components/Session";
import UploadDocument from "./_components/UploadDocument";
import styles from "./page.module.css";

const Page = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { sessions, loading, error, currentSession } =
    useAppSelector(selectSessions);
  const dispatch = useAppDispatch();

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

    dispatch(startSession(formData))
      .unwrap()
      .then((res) => {
        router.push(`/chat/${res.id}`);
      });

    setIsModalOpen(false);
    setFile(null);
  };

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this session?")) return;

    dispatch(deleteSession(id));
  };
  return (
    <Box className={styles.mainLayout}>
      <Stack className={styles.heroSection}>
        <Box className={styles.image_placeholder}>
          <Image src={heroImage} alt="RAG Illustration" priority />
        </Box>
      </Stack>

      <Stack spacing={4} className={styles.contentSection}>
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
          loading={loading}
          error={error}
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
