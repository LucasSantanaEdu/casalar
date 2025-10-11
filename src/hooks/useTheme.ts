import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
            if (storedTheme) {
                setTheme(storedTheme);
                document.documentElement.classList.add(storedTheme);
            }
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const nextTheme: "light" | "dark" = prev === "dark" ? "light" : "dark";
            document.documentElement.classList.replace(prev || "light", nextTheme);
            localStorage.setItem("theme", nextTheme);
            return nextTheme;
        });
    };
    return [theme, toggleTheme] as const;
}