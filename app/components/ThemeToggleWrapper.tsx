"use client"; // Necesario para usar usePathname()

import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

export default function ThemeToggleWrapper() {
	const pathname = usePathname();
	if (pathname.startsWith("/stream/")) return null; // No mostrar en stream/[id]

	return (
		<div className="p-4 flex justify-end items-center">
			<ThemeSwitcher />
		</div>
	);
}
