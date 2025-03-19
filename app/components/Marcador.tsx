import Image from "next/image";
import { Partido } from "@/types/partido";
const Marcador: React.FC<Partido> = (props) => {
	return (
		<div className={`mx-auto ${"rounded-t-lg"} overflow-hidden text-[0.8rem]`}>
			{/* Primer Div */}
			<div className="flex bg-purple-900 px-2 py-1">
				<div className="w-7/12">
					{props.liga ? (
						<p className="text-left font-bold text-white">
							{`${props.jugador1Equipo} ${props.resultadoEquipo1} - ${props.resultadoEquipo2} ${props.jugador2Equipo}`}
						</p>
					) : (
						<p className="text-left font-bold text-white">
							{props.nombreTorneo}
						</p>
					)}
				</div>
				<div className="w-5/12 ml-[2rem] flex justify-start items-center text-white">
					<p
						className={`w-8 px-2 text-center ${
							props.setIndex === 0 ? "font-bold" : "font-normal"
						}`}
					>
						1
					</p>
					<p
						className={`w-8 px-2 text-center ${
							props.setIndex === 1 ? "font-bold" : "font-normal"
						}`}
					>
						2
					</p>
					<p
						className={`w-8 px-2 text-center ${
							props.setIndex === 2 ? "font-bold" : "font-normal"
						}`}
					>
						3
					</p>
					{props.setIndex >= 3 && (
						<p
							className={`w-8 px-2 text-center ${
								props.setIndex === 3 ? "font-bold" : "font-normal"
							}`}
						>
							4
						</p>
					)}
					{props.setIndex >= 4 && (
						<p
							className={`w-8 px-2 text-center ${
								props.setIndex === 4 ? "font-bold" : "font-normal"
							}`}
						>
							5
						</p>
					)}
				</div>
			</div>

			{/* Segundo Div */}
			<div className="flex px-2 py-1 items-center bg-white">
				<div className="w-6/12 flex">
					{props.escudoEquipo1 && (
						<Image
							className="w-6 mr-2 self-center"
							alt="away-logo"
							src={props.escudoEquipo1}
							width={24}
							height={24}
						/>
					)}
					<div className="flex flex-col">
						<p className="text-sm font-bold text-black">{props.jugador1}</p>
						{props.dobles && (
							<div className="flex flex-col">
								<p className="text-sm font-bold text-black">
									{props.parejaJugador1}
								</p>
							</div>
						)}
						{props.liga ? (
							<p className=" text-gray-600">
								{props.jugador1Equipo} ({props.resultadoEquipo1})
							</p>
						) : (
							<p className=" text-gray-600">{props.jugador1Equipo}</p>
						)}
					</div>
				</div>
				<div className="w-1/12 ml-[2rem] flex justify-center items-center">
					{props.saqueActual === "jugador1" && (
						<Image
							className="w-5 mr-2 self-center"
							alt="shuttle"
							src="https://cdn-icons-png.flaticon.com/512/3679/3679484.png"
							width={20}
							height={20}
						/>
					)}
				</div>
				<div className="w-5/12 flex justify-start items-center">
					<p
						className={`w-8 px-1 text-center text-black ${
							props.setIndex === 0 && "font-bold"
						}`}
					>
						{props.puntuacion[0].jugador1}
					</p>
					<p
						className={`w-8 px-1 text-center text-black ${
							props.setIndex === 1 && "font-bold"
						}`}
					>
						{props.puntuacion[1].jugador1}
					</p>
					<p
						className={`w-8 px-1 text-center text-black ${
							props.setIndex === 2 && "font-bold"
						}`}
					>
						{props.puntuacion[2].jugador1}
					</p>
					{props.setIndex >= 3 && (
						<p
							className={`w-8 px-1 text-center text-black ${
								props.setIndex === 3 && "font-bold"
							}`}
						>
							{props.puntuacion[3].jugador1}
						</p>
					)}
					{props.setIndex >= 4 && (
						<p
							className={`w-8 px-1 text-center text-black ${
								props.setIndex === 4 && "font-bold"
							}`}
						>
							{props.puntuacion[4].jugador1}
						</p>
					)}
				</div>
			</div>
			<div
				className={`flex px-2 py-1 items-center bg-white ${"rounded-br-lg"} border-t-1 border-gray-300`}
			>
				<div className="w-6/12 flex">
					{props.escudoEquipo2 && (
						<Image
							className="w-6 mr-2 self-center"
							alt="home-logo"
							src={props.escudoEquipo2}
							width={24}
							height={24}
						/>
					)}
					<div className="flex flex-col">
						<p className="text-sm font-bold text-black">{props.jugador2}</p>
						{props.dobles && (
							<div className="flex flex-col">
								<p className="text-sm font-bold text-black">
									{props.parejaJugador2}
								</p>
							</div>
						)}
						{props.liga ? (
							<p className=" text-gray-600">
								{props.jugador2Equipo} ({props.resultadoEquipo2})
							</p>
						) : (
							<p className=" text-gray-600">{props.jugador2Equipo}</p>
						)}
					</div>
				</div>
				<div className="w-1/12 ml-[2rem] flex justify-center items-center">
					{props.saqueActual === "jugador2" && (
						<Image
							className="w-5 mr-2 self-center"
							alt="shuttle"
							src="https://cdn-icons-png.flaticon.com/512/3679/3679484.png"
							width={20}
							height={20}
						/>
					)}
				</div>
				<div className="w-5/12 flex justify-start items-center">
					<p
						className={`w-8 px-1 text-center text-black ${
							props.setIndex === 0 && "font-bold"
						}`}
					>
						{props.puntuacion[0].jugador2}
					</p>
					<p
						className={`w-8 px-1 text-center text-black ${
							props.setIndex === 1 && "font-bold"
						}`}
					>
						{props.puntuacion[1].jugador2}
					</p>
					<p
						className={`w-8 px-1 text-center text-black ${
							props.setIndex === 2 && "font-bold"
						}`}
					>
						{props.puntuacion[2].jugador2}
					</p>
					{props.setIndex >= 3 && (
						<p
							className={`w-8 px-1 text-center text-black ${
								props.setIndex === 3 && "font-bold"
							}`}
						>
							{props.puntuacion[3].jugador2}
						</p>
					)}
					{props.setIndex >= 4 && (
						<p
							className={`w-8 px-1 text-center text-black ${
								props.setIndex === 4 && "font-bold"
							}`}
						>
							{props.puntuacion[4].jugador2}
						</p>
					)}
				</div>
			</div>

			<div
				className={`bg-gray-200 px-1 shadow-md py-[0.10rem] ${"max-w-[10rem] rounded-b-lg"}`}
			>
				<p className="text-gray-600 text-center">{props.categoria}</p>
			</div>
		</div>
	);
};

export default Marcador;
