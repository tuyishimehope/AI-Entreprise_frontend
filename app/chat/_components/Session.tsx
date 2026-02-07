import { Box, Typography, Stack, Paper } from "@mui/material";
import router from "next/router";
import React from "react";
import styles from "./Sessions.module.css";
import { SessionData } from "../../types/Session.type";
import DeleteIcon from "@mui/icons-material/Delete";

interface SessionProps {
  sessions: SessionData[];
  handleDeleteSession: (e: React.MouseEvent, id: string) => Promise<void>;
}

const Session = ({ sessions, handleDeleteSession }: SessionProps) => {
  return (
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
              <Box>
                <Typography variant="body1" fontWeight="600">
                  {session.title}
                </Typography>
                <Typography variant="caption">
                  {new Date(session.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <DeleteIcon onClick={(e) => handleDeleteSession(e, session.id)} />
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default Session;
