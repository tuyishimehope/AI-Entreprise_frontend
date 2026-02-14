"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  useColorScheme,
  IconButton,
  Paper,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./navbar.module.css";
import { useParams, useRouter } from "next/navigation";

type ThemeOptionProps = {
  icon: ReactElement;
  label: string;
  onClick: () => void;
  active: boolean;
};

const Navbar = () => {
  const { mode, setMode } = useColorScheme();
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const parms = useParams();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box component="nav" className={styles.navbarContainer}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          variant="body2"
          fontWeight="500"
          className={styles.breadcrumbItem}
          onClick={() => router.push("/")}
        >
          Home
        </Typography>

        <KeyboardArrowRightIcon
          sx={{ fontSize: 16, color: "var(--color-text-muted)" }}
        />

        <Typography
          variant="body2"
          fontWeight="500"
          className={styles.breadcrumbItem}
          onClick={() => router.push("/chat")}
        >
          Chat
        </Typography>

        <KeyboardArrowRightIcon
          sx={{ fontSize: 16, color: "var(--color-text-muted)" }}
        />

        {parms.id && (
          <Typography
            variant="body2"
            fontWeight="600"
            color="var(--color-text-primary)"
            sx={{
              maxWidth: 150,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            ID_{parms?.id.slice(0, 5)}...
          </Typography>
        )}
      </Box>

      <Box className={styles.settingsWrapper}>
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
            <Paper elevation={4} className={styles.themesDropdown}>
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
    className={`${styles.themeItem} ${active ? styles.activeOption : ""}`}
    onClick={onClick}
  >
    {icon}
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export default Navbar;
