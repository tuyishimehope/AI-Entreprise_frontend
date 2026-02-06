"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  useColorScheme,
  IconButton,
  Paper,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./navbar.module.css";

type ThemeOptionProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  onClick: () => void;
  active: boolean;
};

const Navbar = () => {
  const { mode, setMode } = useColorScheme();
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent hydration mismatch: only render UI after mount if using mode
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Box className={styles.navbar_container} />;

  return (
    <Box component="nav" className={styles.navbar_container}>
      <Typography variant="h6" fontWeight="700">
        Logo/Nav
      </Typography>

      <Box className={styles.settings_wrapper}>
        <Typography variant="body2" color="var(--text-muted)">
          User Name
        </Typography>

        <Box ref={menuRef} sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setToggle(!toggle)}
            className={toggle ? styles.iconActive : styles.iconIdle}
          >
            <SettingsIcon sx={{ color: "var(--foreground)" }} />
          </IconButton>

          {toggle && (
            <Paper elevation={4} className={styles.themes_dropdown}>
              <ThemeOption
                icon={<SettingsBrightnessIcon fontSize="small" />}
                label="System"
                active={mode === "system"}
                onClick={() => {
                  setMode("system");
                  setToggle(false);
                }}
              />
              <ThemeOption
                icon={<LightModeIcon fontSize="small" />}
                label="Light"
                active={mode === "light"}
                onClick={() => {
                  setMode("light");
                  setToggle(false);
                }}
              />
              <ThemeOption
                icon={<DarkModeIcon fontSize="small" />}
                label="Dark"
                active={mode === "dark"}
                onClick={() => {
                  setMode("dark");
                  setToggle(false);
                }}
              />
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ThemeOption = ({ icon, label, onClick, active }: ThemeOptionProps) => (
  <Box
    className={`${styles.theme_item} ${active ? styles.active_option : ""}`}
    onClick={onClick}
  >
    {icon}
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export default Navbar;
