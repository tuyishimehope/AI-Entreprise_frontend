import { Box, Typography, Stack, Paper, Skeleton } from "@mui/material";
import styles from "./Sessions.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { SessionProps } from "@/app/types/Session.type";

const Session = ({
  sessions,
  handleDeleteSession,
  loading,
  error,
}: SessionProps) => {
  const router = useRouter();
  const skeletonCount = 5;

  return (
    <Box className={styles.sessionContainer}>
      <Typography variant="h6">Recent Sessions</Typography>
      <Stack className={styles.sessionContainer__sessions}>
        {error && <Typography color="error">{error}</Typography>}
        {loading &&
          Array.from(new Array(skeletonCount)).map((_, index) => (
            <Paper key={index} className={styles.sessionCard}>
              <Box sx={{ width: "100%" }}>
                <Skeleton variant="text" width="60%" height={25} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
            </Paper>
          ))}
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
                  {loading ? <Skeleton /> : session.title}
                </Typography>
                <Typography
                  variant="caption"
                  className={styles.sessionCard__title}
                >
                  {loading ? (
                    <Skeleton />
                  ) : (
                    new Date(session.created_at).toLocaleDateString()
                  )}
                </Typography>
              </Box>
              {loading ? (
                <Skeleton />
              ) : (
                <DeleteIcon
                  className={styles.sessionCard__delete}
                  onClick={(e) => handleDeleteSession(e, session.id)}
                />
              )}
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default Session;
