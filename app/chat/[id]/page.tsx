"use client";

import { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import ChatForm from "../../components/ChatForm";
import ChatMessage from "../../components/ChatMessage";
import PdfClientViewer from "../../components/PdfClientViewer";
import { api } from "../../util/api";
import { ChatsData } from "../../types/chat.type";
import styles from "./page.module.css";
import { useParams } from "next/navigation";

const Page = () => {
  const [query, setQuery] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [data, setData] = useState<ChatsData[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState("");
  const session_id = useParams();

  const fetchHistory = useCallback(async () => {
    console.log(session_id);
    try {
      const { data: history } = await axios.get(
        `${api}/history/${session_id.id}`,
      );
      setData(history);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  }, []);

  const getFileId = async () => {
    const result = await axios.get(`${api}/session/${session_id.id}`);
    setFileId(result.data[0].document_id);
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

    // 1. OPTIMISTIC UPDATE: Add the question immediately
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
    setData((prev) => [...prev, optimisticMessage]);
    setIsLoading(true);

    try {
      // 3. Send Chat Request
      const chatFormData = new FormData();
      chatFormData.append("question", currentQuery);
      chatFormData.append("file_id", fileId);
      chatFormData.append("session_id", session_id.id);

      const { data: responseData } = await axios.post(
        `${api}/chat`,
        chatFormData,
      );

      // 4. REPLACE optimistic message with real data
      setData((prev) =>
        prev.map((msg) => (msg.id === tempId ? responseData : msg)),
      );
    } catch (error) {
      // 5. ERROR RECOVERY: Remove the failed message or show error
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
          fileUrl={`${api}/file/${fileId}`}
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
