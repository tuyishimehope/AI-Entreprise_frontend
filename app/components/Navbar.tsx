"use client";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Typography, useColorScheme } from "@mui/material";
import styles from "./navbar.module.css";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { mode, setMode } = useColorScheme();
  const [toggle, setToggle] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode("system");
    const handleClickOutside = (e: MouseEvent) => {
      if (docRef.current && !docRef.current.contains(e.target as Node)) {
        setToggle(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Box className={styles.navbar_container}>
      <Box></Box>
      <Box>
        <Box className={styles.settings}>
          <Typography variant="h6">User</Typography>
          <Box ref={docRef}>
            {mode}
            <SettingsIcon onClick={() => setToggle(!toggle)} />
            {toggle && (
              <Box className={styles.themes}>
                <Box className={styles.theme} onClick={() => setMode("system")}>
                  <DoorSlidingIcon /> <Typography>System</Typography>
                </Box>
                <Box className={styles.theme} onClick={() => setMode("dark")}>
                  <DarkModeIcon />
                  <Typography>Dark</Typography>
                </Box>
                <Box className={styles.theme} onClick={() => setMode("light")}>
                  <LightModeIcon />
                  <Typography>Light</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
