"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./util/theme";
import StoreProvider from "./StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StoreProvider>
    </>
  );
}
