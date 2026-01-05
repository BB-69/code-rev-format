import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ButtonToggle from "./button-toggle";

export interface ThemeState {
  theme: "dark" | "light" | null;
  isDark: boolean;
  setTheme: (theme: "dark" | "light" | null) => void;
}
const ThemeContext = createContext<ThemeState>({
  theme: null,
  isDark: false,
  setTheme: () => {},
});
export const useTheme = () => useContext(ThemeContext);

function getCurrentTheme(): "dark" | "light" | null {
  const theme = localStorage?.getItem("theme");
  return theme === "dark" || theme === "light" ? theme : null;
}
function currentThemeIsDark() {
  switch (getCurrentTheme()) {
    case "dark":
      return true;
    case "light":
      return false;
    default:
      return (
        window?.matchMedia("(prefers-color-scheme: dark)").matches || false
      );
  }
}
const applyTheme = () => {
  if (typeof document !== "undefined") {
    if (currentThemeIsDark()) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
};

export function ThemeProvider(props: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  applyTheme();
  const updateTheme = () => {
    setTheme(getCurrentTheme());
    const isDark = currentThemeIsDark();
    setIsDark(isDark);
    applyTheme();
  };
  useEffect(() => {
    updateTheme();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", updateTheme);
    const i = setInterval(updateTheme, 1000);
    return () => {
      mql.removeEventListener("change", updateTheme);
      clearInterval(i);
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme: (theme: "dark" | "light" | null) => {
          if (theme !== null) {
            localStorage?.setItem("theme", theme);
          } else {
            localStorage?.removeItem("theme");
          }
          updateTheme();
        },
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export function ThemeSwitcher({
  systemTheme = false,
}: {
  systemTheme?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark" && systemTheme) setTheme(null);
    else setTheme("light");
  };

  const icon = theme === "light" ? "🌞" : theme === "dark" ? "🌙" : "🎲";

  return (
    <div
      className="w-[60px] h-[60px] flex justify-center items-center
      rounded-md text-[18px]"
    >
      <ButtonToggle onToggle={cycle} pxSize={{ w: 40, h: 40 }}>
        {icon}
      </ButtonToggle>
    </div>
  );
}
