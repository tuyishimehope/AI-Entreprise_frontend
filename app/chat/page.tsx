"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styles from "./page.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;
const Page = () => {
  const [query, setQuery] = useState<string | null>();
  const [file, setFile] = useState<File | null>();
  const [data, setData] = useState();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target?.files[0]);
    }
  };
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSubmit = async () => {
    if (file && query?.trim()) {
      console.log("query", query);
      console.log("file", file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", query);
      const response = await axios.post(`${api}/chat`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response);
      setData(response.data);
    } else {
      console.log("file", file);
      console.log("please upload file or enter query");
    }
  };
  useEffect(() => {
    async function getData() {
      const response = await axios.get(`${api}/history`);
      console.log("response", response);
      setData(response.data);
    }
    getData();
  }, []);
  return (
    <Box className={styles.chat_container}>
      {/* <Box className={styles.chat_document}></Box> */}
      <Box className={styles.chat_content}>
        {!data && (
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
        )}
        <Box className={styles.chat_input_container}>
          <input
            type="text"
            placeholder="type a question"
            onChange={handleQueryChange}
          />
          <Button className={styles.chat_input_button} onClick={handleSubmit}>
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
