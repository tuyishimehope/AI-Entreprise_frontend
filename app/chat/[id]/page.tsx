"use client";

import { selectSessions } from "@/app/lib/features/Sessions/SessionsSelectors";
import {
  fetchSessionById,
  getFileId,
  sendMessage,
} from "@/app/lib/features/Sessions/SessionsThunks";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PdfClientViewer from "../../components/PdfClientViewer";
import { ChatsData } from "../../types/chat.type";
import { api } from "../../util/api";
import ChatForm from "../_components/ChatForm";
import ChatMessage from "../_components/ChatMessage";
import styles from "./page.module.css";
import apiClient from "@/app/util/apiClient";

const Page = () => {
  const [query, setQuery] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ChatsData[]>([]);
  const [activeHighlight, setActiveHighlight] = useState("");
  const { id: session_id } = useParams();
  const dispatch = useAppDispatch();
  const {
    loading,
    error,
    fileId,
    data: messages,
  } = useAppSelector(selectSessions);

  useEffect(() => {
    if (session_id) {
      dispatch(fetchSessionById(session_id as string));
      dispatch(getFileId(session_id as string));
    }
  }, [dispatch, session_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const chatFormData = new FormData();
    chatFormData.append("question", query);
    chatFormData.append("file_id", String(fileId));
    chatFormData.append("session_id", String(session_id));

    setQuery("");

    dispatch(sendMessage(chatFormData));
  };
  return (
    <Box className={styles.chat_container}>
      <Box className={styles.chat_document}>
        <PdfClientViewer
          fileUrl={`${api}/files/${fileId}/download`}
          highlightText={activeHighlight}
        />
      </Box>
      <Box className={styles.chat_content}>
        <ChatMessage
          data={messages}
          setActiveHighlight={setActiveHighlight}
          loading={loading}
        />
        <ChatForm
          file={file}
          isLoading={loading}
          query={query}
          handleSubmit={handleSubmit}
          setFile={setFile}
          setQuery={setQuery}
        />
      </Box>
    </Box>
  );
};

export default Page;
