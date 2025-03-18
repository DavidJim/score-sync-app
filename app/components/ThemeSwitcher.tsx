"use client"; // Necesario en Next.js 15 para usar useState y useEffect

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
	const [theme, setTheme] = useState<string | null>(null);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") || "light";
		setTheme(savedTheme);
		document.documentElement.setAttribute("data-theme", savedTheme);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
	};

	return (
		<button
			onClick={toggleTheme}
			className="btn btn-primary flex items-center gap-2"
		>
			{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
		</button>
	);
};

export default ThemeSwitcher;
