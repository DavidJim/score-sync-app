"use client"; // Necesario para usar usePathname()

import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import { Home } from "lucide-react";
import Link from "next/link";

export default function ThemeToggleWrapper() {
	const pathname = usePathname();
	if (pathname.startsWith("/stream/")) return null; // No mostrar en stream/[id]

	return (
		<div className="flex justify-between">
			<div className="p-4 flex justify-start items-center">
				<button className="btn btn-accent flex items-center gap-2">
					<Link href={`/`}>
						<Home size={20} />
					</Link>
				</button>
			</div>
			<div className="p-4 flex justify-end items-center">
				<ThemeSwitcher />
			</div>
		</div>
	);
}
