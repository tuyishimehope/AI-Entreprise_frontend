"use client";

import { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import ChatForm from "../_components/ChatForm";
import ChatMessage from "../_components/ChatMessage";
import PdfClientViewer from "../../components/PdfClientViewer";
import { api } from "../../util/api";
import { ChatsData } from "../../types/chat.type";
import styles from "./page.module.css";
import { useParams } from "next/navigation";

const Page = () => {
  const [query, setQuery] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [data, setData] = useState<ChatsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState("");
  const parms = useParams();
  const session_id = parms.id;

  const fetchHistory = useCallback(async () => {
    try {
      const { data: history } = await axios.get(`${api}/history/${session_id}`);
      setData(history);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  }, []);

  const getFileId = async () => {
    const result = await axios.get(`${api}/session/${session_id}`);
    setFileId(result.data.document_id);
  };

  useEffect(() => {
    getFileId();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const tempId = Date.now().toString();

    const optimisticMessage: ChatsData = {
      id: tempId,
      question: currentQuery,
      answer: "Thinking...",
      sources: [],
      created_at: "",
      document_id: "",
      document: {
        filename: "",
        id: "",
        created_at: "",
      },
      file_id: "",
    };

    setQuery("");
    setData((prev) => [...(prev ?? []), optimisticMessage]);
    setIsLoading(true);

    try {
      const chatFormData = new FormData();
      if (currentQuery && typeof currentQuery === "string") {
        chatFormData.append("question", currentQuery);
      }

      if (fileId && session_id) {
        const documentId = String(fileId);
        const sessionId = String(session_id);
        chatFormData.append("file_id", documentId);
        chatFormData.append("session_id", sessionId);
      }

      const { data: responseData } = await axios.post(
        `${api}/chat`,
        chatFormData,
      );

      setData((prev) =>
        prev.map((msg) => (msg.id === tempId ? responseData : msg)),
      );
    } catch (error) {
      setData((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, answer: "Error: Could not reach AI." }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
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
        <ChatMessage data={data} setActiveHighlight={setActiveHighlight} />
        <ChatForm
          file={file}
          isLoading={isLoading}
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
