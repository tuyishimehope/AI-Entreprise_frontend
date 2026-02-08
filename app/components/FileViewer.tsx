"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

import { useEffect, useRef } from "react";
import styles from "./FileViewer.module.css";
import { useColorScheme } from "@mui/material";

export default function FileViewer({
  fileUrl,
  highlightText,
}: {
  fileUrl: string;
  highlightText?: string;
}) {
  const searchPluginInstance = searchPlugin();
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
  });
  const theme = useColorScheme();

  const { highlight, jumpToMatch, clearHighlights } = searchPluginInstance;

  const readyRef = useRef(false);
  const lastSnippetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!readyRef.current || !highlightText) return;

    const snippet = highlightText
      .replace(/\s+/g, " ")
      .replace(/\n/g, " ")
      .trim()
      .slice(0, 50);

    if (lastSnippetRef.current === snippet) return;
    lastSnippetRef.current = snippet;

    clearHighlights();
    requestAnimationFrame(() => {
      highlight(snippet);
      jumpToMatch(0);
    });
  }, [highlightText, highlight, jumpToMatch, clearHighlights]);

  return (
    <div className={styles.container}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
          onDocumentLoad={() => {
            readyRef.current = true;
          }}
          theme={theme.colorScheme}
        />
      </Worker>
    </div>
  );
}
