"use client";
import { notFound } from "next/navigation";
import Marcador from "@/components/Marcador";
import { useState, useEffect, use } from "react";
import { ImagePlus, Copy } from "lucide-react";
import io from "socket.io-client";
import { useAlert } from "@/context/AlertContext";
import { Partido } from "@/types/partido";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);

const PartidoStream = ({ params }: { params: Promise<{ id: string }> }) => {
	const { showAlert } = useAlert();
	const [partido, setPartido] = useState<Partido>({
		jugador1: "",
		jugador2: "",
		parejaJugador1: "",
		parejaJugador2: "",
		jugador1Equipo: "",
		jugador2Equipo: "",
		resultadoEquipo1: "0",
		resultadoEquipo2: "0",
		escudoEquipo1: null as string | null,
		escudoEquipo2: null as string | null,
		saqueActual: "jugador1",
		categoria: "Selecciona Categoría",
		setIndex: 0,
		saqueInicial: "jugador1",
		nombreTorneo: "BFTV",
		dobles: false,
		liga: false,
		puntuacion: [
			{ jugador1: 0, jugador2: 0 },
			{ jugador1: 0, jugador2: 0 },
			{ jugador1: 0, jugador2: 0 },
			{ jugador1: 0, jugador2: 0 },
			{ jugador1: 0, jugador2: 0 },
		],
		reduced: false,
	});

	const partidoId = use(params);
	const idPartido = partidoId.id;

	useEffect(() => {
		if (!idPartido) return;

		socket.emit("unirsePartido", { idPartido });

		socket.on("infoPartido", (infoPartido) => {
			setPartido((prev: Partido) => ({
				...prev,
				...infoPartido,
			}));
		});

		return () => {
			socket.off("infoPartido");
		};
	}, [idPartido]);

	return (
		<>
			<style jsx global>{`
				html,
				body,
				#__next {
					background: transparent !important;
				}
			`}</style>
			<div className="absolute max-w-[24rem] min-w-[24rem] h-auto overflow-hidden bg-transparent">
				<Marcador {...partido} />
			</div>
		</>
	);
};

export default PartidoStream;
