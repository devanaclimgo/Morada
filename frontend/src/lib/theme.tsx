import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemePref = "light" | "dark" | "system";

type ThemeCtx = {
  theme: ThemePref;
  setTheme: (t: ThemePref) => void;
};

const Ctx = createContext<ThemeCtx>({ theme: "system", setTheme: () => {} });

const STORAGE_KEY = "roomy.theme";

function apply(theme: ThemePref) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePref>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePref | null;
    if (stored) setThemeState(stored);
    apply(stored ?? "system");
  }, []);

  useEffect(() => {
    apply(theme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => theme === "system" && apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (t: ThemePref) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  };

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
