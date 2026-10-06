import { useCallback, useEffect, useState } from "react";

const KEY = "theme";
const root = () => document.documentElement;

export function useTheme() {
  const [dark, setDark] = useState(() => root().classList.contains("dark"));

  const setTheme = useCallback((next: boolean) => {
    root().classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* private mode */
    }
    setDark(next);
  }, []);

  // Follow the OS setting until the visitor picks a theme explicitly.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (localStorage.getItem(KEY)) return;
      root().classList.toggle("dark", !mq.matches);
      setDark(!mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { dark, setTheme };
}
