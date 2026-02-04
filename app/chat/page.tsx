"use client";

import LinkIcon from "@mui/icons-material/Link";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEvent, Key, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import PdfClientViewer from "../components/PdfClientViewer";

const api = process.env.NEXT_PUBLIC_API_URL;
type ResponseData = {
  id: string;
  question: string;
  answer: string;
  sources: string[];
  document_id: string;
  file_id: string;
};
type Document = {
  filename: string;
  id: string;
  created_at: string;
};

type ChatsData = {
  question: string;
  answer: string;
  sources: string[];
  id: string;
  created_at: string;
  document_id: string;
  document: Document;
  file_id: string;
};

const Page = () => {
  const [query, setQuery] = useState<string | null>();
  const [file, setFile] = useState<File | null>();
  const [fileId, setFileId] = useState<string | null>();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState("");
  const lastMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target?.files[0]);
    }
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query?.trim() || isLoading) return;

    const currentQuery = query;
    setQuery("");
    setIsLoading(true);

    const tempId = Date.now();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setData((prev) => [
      ...(prev || []),
      { question: currentQuery, answer: "...", id: tempId },
    ]);

    try {
      let activeFileId = fileId;

      if (file && !activeFileId) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(`${api}/file`, formData);
        activeFileId = res.data.id;
        setFileId(activeFileId);
      }

      const chatFormData = new FormData();
      chatFormData.append("question", currentQuery);
      if (activeFileId) chatFormData.append("file_id", activeFileId);

      const response = await axios.post(`${api}/chat`, chatFormData);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setData((prev) =>
        prev?.map((msg) => (msg.id === tempId ? response.data : msg)),
      );
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`${api}/history`);
      setData(response.data);
      console.log(response.data);
      setFileId(response.data[0].document_id);
    }
    getData();
  }, []);

  return (
    <Box className={styles.chat_container}>
      <Box className={styles.chat_document}>
        {/* <PdfViewer fileUrl="./sample-policy.pdf" searchText={activeHighlight} /> */}
        <PdfClientViewer
          fileUrl="./sample-policy.pdf"
          highlightText={activeHighlight}
        />
      </Box>
      <form className={styles.chat_content} onSubmit={handleSubmit}>
        <Box className={styles.message_container}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data?.map((d: any, index: Key) => (
            <Box
              key={index}
              className={styles.chat_bubble}
              ref={index === data.length - 1 ? lastMessagesRef : null}
            >
              <Box className={styles.question_bubble}>{d.question}</Box>
              <Box className={styles.answer_bubble}>
                <ReactMarkdown>{d.answer}</ReactMarkdown>
                <span>
                  {d.sources?.map((source: string, index: Key) => (
                    <span
                      key={index}
                      className={styles.citation}
                      onClick={() => {
                        const snippet = source.substring(0, 30);
                        setActiveHighlight(snippet);
                      }}
                    >
                      <LinkIcon />
                    </span>
                  ))}
                </span>
              </Box>
            </Box>
          ))}
        </Box>
        {/* {!data && (
          <Box className={styles.chat_upload_container}>
            <Box className={styles.chat_upload_container_content}>
              <Typography variant="h5">Upload file</Typography>
              <TextField
                type="file"
                placeholder="upload file"
                onChange={handleFileChange}
              />
            </Box>
          </Box>
        )} */}
        <Box className={styles.chat_input_container}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={query || ""}
            type="text"
            onChange={handleQueryChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
            placeholder="Ask a question..."
            InputProps={{
              endAdornment: (
                <Button type="submit" disabled={isLoading || !query?.trim()}>
                  {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </Button>
              ),
            }}
          />
        </Box>
      </form>
    </Box>
  );
};

export default Page;
