"use client";

import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const navigate = useRouter();
  return (
    <Container className="flex-col items-center justify-center w-full h-screen pt-10 text-center">
      <Typography variant="h2">FRONTEND ENTERPRISE RAG</Typography>
      <Typography variant="h3">Chat with document</Typography>
      <Button onClick={() => navigate.push("/chat")} variant="contained">
        start
      </Button>
      <Button onClick={() => navigate.push("/learn")} variant="contained">
        Learn
      </Button>
    </Container>
  );
}
