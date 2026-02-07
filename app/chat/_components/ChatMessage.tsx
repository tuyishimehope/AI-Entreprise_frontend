import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LinkIcon from "@mui/icons-material/Link";
import { ChatsData } from "../../types/chat.type";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useRef } from "react";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  data: ChatsData[] | null;
  setActiveHighlight: Dispatch<SetStateAction<string>>;
}

const ChatMessage = ({ data, setActiveHighlight }: ChatMessageProps) => {
  const lastMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [data]);

  return (
    <Box className={styles.message_container}>
      {data &&
        data?.map((chat, idx) => (
          <Box
            key={chat.id || idx}
            className={styles.chat_bubble}
            ref={idx === data.length - 1 ? lastMessagesRef : null}
          >
            <Box className={styles.question_bubble}>{chat.question}</Box>
            <Box className={styles.answer_bubble}>
              <ReactMarkdown>{chat.answer}</ReactMarkdown>

              {chat.sources && chat.sources.length > 0 && (
                <div className={styles.citation_wrapper}>
                  {chat.sources.map((source, sIdx) => (
                    <span
                      key={sIdx}
                      className={styles.citation}
                      onClick={() => {
                        const snippet = source
                          .trim()
                          .split(" ")
                          .slice(0, 10)
                          .join(" ");
                        setActiveHighlight(snippet);
                      }}
                    >
                      <LinkIcon />
                    </span>
                  ))}
                </div>
              )}
            </Box>
          </Box>
        ))}
    </Box>
  );
};
export default ChatMessage;
