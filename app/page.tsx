"use client";
import Image from "next/image";
import Link from "next/link";
import { useAlert } from "@/context/AlertContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
	const [theme, setTheme] = useState<string | null>(null);
	const [idPartido, setIdPartido] = useState<string>("");
	const { showAlert } = useAlert();
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleNuevoPartido = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/api/nuevo-partido`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				}
			);

			if (!response.ok) throw new Error("Error al crear el partido");

			const data = await response.json();
			const partidoId = data.idPartido;

			router.push(`/partido/${partidoId}`);
		} catch (error: any) {
			showAlert(error.toString(), "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Detectar el tema actual en el atributo data-theme del HTML
		const currentTheme =
			document.documentElement.getAttribute("data-theme") || "light";
		setTheme(currentTheme);

		// Observar cambios en el theme dinámicamente
		const observer = new MutationObserver(() => {
			const newTheme = document.documentElement.getAttribute("data-theme");
			setTheme(newTheme);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		return () => observer.disconnect();
	}, []);

	return (
		<div className="grid grid-rows-[20px_1fr_20px] justify-items-center  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[16px] row-start-2 items-center">
				<button
					onClick={handleNuevoPartido}
					className="btn bg-[#1fb8ab] text-black"
					disabled={loading}
				>
					{loading ? "Creando..." : "Nuevo partido"}
				</button>
				<div className="divider">O</div>
				<fieldset className="fieldset min-w-[16rem]">
					<legend className="fieldset-legend">Conéctate a un partido</legend>
					<input
						type="text"
						className="input"
						placeholder="ID de partido"
						onChange={(e) => setIdPartido(e.target.value)}
					/>
					<button
						disabled={idPartido === ""}
						className="btn bg-[#1fb8ab] text-black"
					>
						<Link href={`/partido/${idPartido}`}>Ir a partido</Link>
					</button>
				</fieldset>
			</main>
			{/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/file.svg"
						alt="File icon"
						width={16}
						height={16}
					/>
					Learn
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/window.svg"
						alt="Window icon"
						width={16}
						height={16}
					/>
					Examples
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/globe.svg"
						alt="Globe icon"
						width={16}
						height={16}
					/>
					Go to nextjs.org →
				</a>
			</footer> */}
		</div>
	);
}
