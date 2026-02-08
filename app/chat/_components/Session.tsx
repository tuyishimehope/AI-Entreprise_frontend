import { Box, Typography, Stack, Paper } from "@mui/material";
import styles from "./Sessions.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { SessionProps } from "@/app/types/Session.type";

const Session = ({ sessions, handleDeleteSession }: SessionProps) => {
  const router = useRouter();

  return (
    <Box className={styles.sessionContainer}>
      <Typography variant="h6">Recent Sessions</Typography>
      <Stack className={styles.sessionContainer__sessions}>
        {sessions.length === 0 ? (
          <Typography color="var(--text-muted)">
            No sessions yet. Start by uploading a file.
          </Typography>
        ) : (
          sessions.map((session) => (
            <Paper
              key={session.id}
              className={styles.sessionCard}
              onClick={() => router.push(`/chat/${session.id}`)}
            >
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  className={styles.sessionCard__title}
                >
                  {session.title}
                </Typography>
                <Typography
                  variant="caption"
                  className={styles.sessionCard__title}
                >
                  {new Date(session.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <DeleteIcon
                className={styles.sessionCard__delete}
                onClick={(e) => handleDeleteSession(e, session.id)}
              />
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default Session;
