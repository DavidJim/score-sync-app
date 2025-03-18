"use client";
import { notFound } from "next/navigation";
import Marcador from "@/components/Marcador";
import { useState, useEffect, use } from "react";
import { ImagePlus, Copy } from "lucide-react";
import io from "socket.io-client";
import { useAlert } from "@/context/AlertContext";
import { Partido } from "@/types/partido";

const socket = io("http://192.168.1.33:3001");

interface SetPuntuacion {
	jugador1: number;
	jugador2: number;
}

const PartidoPage = ({ params }: { params: Promise<{ id: string }> }) => {
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

	const actualizarPuntuacion = (
		setIndex: number,
		jugador: "jugador1" | "jugador2",
		incremento: number,
		reset?: boolean
	) => {
		setPartido((prev: Partido) => {
			const partidoActualizado = {
				...prev,
				puntuacion: prev.puntuacion.map((set: SetPuntuacion, index: number) =>
					index === setIndex
						? {
								...set,
								[jugador]: reset ? 0 : Math.max(0, set[jugador] + incremento),
						  }
						: set
				),
				saqueActual: jugador,
			};

			// Llamar a actualizaServidor después de actualizar el estado
			actualizaServidor(partidoActualizado);
			return partidoActualizado;
		});
	};

	const actualizarSet = (setIndex: number) => {
		if (setIndex > -1 && setIndex < 5) {
			setPartido((prev: Partido) => {
				const partidoActualizado = { ...prev, setIndex };
				actualizaServidor(partidoActualizado);
				return partidoActualizado;
			});
		}
	};

	const actualizarServicio = (jugador: "jugador1" | "jugador2") => {
		setPartido((prev: Partido) => {
			const partidoActualizado = {
				...prev,
				saqueInicial: jugador,
				saqueActual: jugador,
			};
			actualizaServidor(partidoActualizado);
			return partidoActualizado;
		});
	};

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
		equipo: number
	) => {
		//setLoading(true);
		try {
			// Crear un objeto FormData
			const formData = new FormData();

			// Agregar los archivos al FormData
			if (event.target.files) {
				const files = event.target.files;
				for (let i = 0; i < files.length; i++) {
					formData.append("sampleFile", files[i]); // "files" es el nombre del campo
				}
			}
			const response = await fetch("http://192.168.1.33:3001/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) throw new Error("Error al subir imagen");

			const data = await response.json();
			const url = "http://192.168.1.33:3001" + data.url;
			console.log(url);
			setPartido((prev: Partido) => {
				const partidoActualizado = {
					...prev,
					escudoEquipo1: equipo === 1 ? url : prev.escudoEquipo1,
					escudoEquipo2: equipo === 2 ? url : prev.escudoEquipo2,
				};
				actualizaServidor(partidoActualizado);
				return partidoActualizado;
			});
		} catch (error: any) {
			console.log("Error:", error);
			showAlert(error.toString(), "error");
		} finally {
			//setLoading(false);
		}
	};

	const handleImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		equipo: number
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setPartido((prev: Partido) => {
				const partidoActualizado = {
					...prev,
					escudoEquipo1: equipo === 1 ? imageUrl : prev.escudoEquipo1,
					escudoEquipo2: equipo === 2 ? imageUrl : prev.escudoEquipo2,
				};
				actualizaServidor(partidoActualizado);
				return partidoActualizado;
			});
		}
	};

	const partidoId = use(params);
	const idPartido = partidoId.id;

	useEffect(() => {
		if (!idPartido) return;

		socket.emit("unirsePartido", { idPartido });

		socket.on("infoPartido", (infoPartido) => {
			console.log("-----------\n", infoPartido);
			setPartido((prev: Partido) => ({
				...prev,
				...infoPartido,
			}));
		});

		return () => {
			socket.off("infoPartido");
		};
	}, [idPartido]);

	const actualizaServidor = (partido: Partido) => {
		socket.emit("actualizaPartido", { idPartido, partido });
	};

	const copiarAlPortapapeles = (texto: string) => {
		navigator.clipboard
			? navigator.clipboard
					.writeText(texto)
					.then(() => {
						showAlert("Texto copiado al portapapeles", "success");
					})
					.catch((err) => {
						showAlert("Error al copiar al portapapeles", "error");
					})
			: unsecuredCopyToClipboard(texto);
	};

	const unsecuredCopyToClipboard = (texto: string) => {
		const textArea = document.createElement("textarea");
		textArea.value = texto;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand("copy");
			showAlert("Texto copiado al portapapeles", "success");
		} catch (err) {
			showAlert("Error al copiar al portapapeles", "error");
		}
		document.body.removeChild(textArea);
	};

	return (
		<div className="flex flex-col justify-center">
			<div className="">
				<div className="divider-default divider"></div>
				<div className="p-2 text-center text-lg font-bold">ID de Partido:</div>
				<div className="p-2 text-center text-xs">
					(Copialo y compártelo para manejar o configurar el marcador)
				</div>
				<div id="textoParaCopiar" className="p-2 text-center text-md">
					{idPartido}
					{/* <button
					onClick={() =>
						copiarAlPortapapeles(
							document.getElementById("textoParaCopiar")?.textContent || ""
						)
					}
					className="p-2 rounded-full"
				>
					<Copy className="text-gray-600 size-6" />
				</button> */}
				</div>
				<div className="flex justify-center">
					<div
						className="badge badge-accent badge-sm"
						onClick={() =>
							copiarAlPortapapeles(
								document.getElementById("textoParaCopiar")?.textContent || ""
							)
						}
					>
						Copiar
					</div>
				</div>
				<div className="divider-default divider"></div>
			</div>
			<div className="p-2 text-center text-lg font-bold">Vista Previa</div>
			<div className="flex justify-center bg-[#1fb8ab] py-2">
				<div className="max-w-[24rem] min-w-[22rem]">
					<Marcador {...partido} />
				</div>
			</div>
			{/* Jugador 1 */}
			<div className="p-2 text-center text-lg font-bold ">
				{partido.jugador1 ? partido.jugador1 : "Jugador 1"}
			</div>
			<div className="flex justify-center p-2">
				<button
					className="btn btn-accent rounded-full text-center font-bold text-white shadow-xl"
					onClick={() => actualizarPuntuacion(partido.setIndex, "jugador1", -1)}
				>
					-
				</button>
				<div className="w-4/12 text-center text-3xl font-bold">
					{partido.puntuacion[partido.setIndex].jugador1}
				</div>
				<button
					className="btn btn-accent rounded-full text-center font-bold text-white"
					onClick={() => {
						actualizarPuntuacion(partido.setIndex, "jugador1", +1);
					}}
				>
					+
				</button>
			</div>
			<div className="flex justify-center p-1">
				<button
					className="btn btn-error mb-4 rounded-full text-center text-xs font-bold text-white"
					onClick={() =>
						actualizarPuntuacion(partido.setIndex, "jugador1", 0, true)
					}
				>
					Reset
				</button>
			</div>

			{/* Jugador 2 */}
			<div className="p-2 text-center text-lg font-bold ">
				{partido.jugador2 ? partido.jugador2 : "Jugador 2"}
			</div>
			<div className="flex justify-center p-2">
				<button
					className="btn btn-accent rounded-full text-center font-bold text-white shadow-xl "
					onClick={() => actualizarPuntuacion(partido.setIndex, "jugador2", -1)}
				>
					-
				</button>
				<div className="w-4/12 text-center text-3xl font-bold">
					{partido.puntuacion[partido.setIndex].jugador2}
				</div>
				<button
					className="btn btn-accent rounded-full text-center font-bold text-white "
					onClick={() => {
						actualizarPuntuacion(partido.setIndex, "jugador2", +1);
					}}
				>
					+
				</button>
			</div>
			<div className="flex justify-center p-1">
				<button
					className="btn btn-error mb-4 rounded-full text-center text-xs font-bold text-white"
					onClick={() =>
						actualizarPuntuacion(partido.setIndex, "jugador2", 0, true)
					}
				>
					Reset
				</button>
			</div>

			{/* Set Actual */}
			<div className="p-2 text-center text-lg font-bold ">Set Actual</div>
			<div className="flex justify-center p-2">
				<button
					className="btn btn-accent rounded-full text-center font-bold text-white shadow-xl"
					onClick={() => actualizarSet(partido.setIndex - 1)}
				>
					-
				</button>
				<div className="w-4/12 text-center text-3xl font-bold">
					{partido.setIndex + 1}
				</div>
				<button
					className="btn btn-accent rounded-full text-center font-bold text-white"
					onClick={() => actualizarSet(partido.setIndex + 1)}
				>
					+
				</button>
			</div>

			{/* Saque Inicial */}
			<div className="divider-default divider">Saque Inicial</div>
			<div className="flex-col justify-center p-2">
				<div className="flex justify-center p-2">
					<input
						type="checkbox"
						className="checkbox mr-2 checkbox-accent"
						checked={partido.saqueInicial === "jugador1"}
						onChange={() => actualizarServicio("jugador1")}
					/>
					<div className="text-center ">
						{partido.jugador1
							? `Servicio ${partido.jugador1}`
							: "Servicio Jugador 1"}
					</div>
				</div>
				<div className="flex justify-center p-2">
					<input
						type="checkbox"
						className="checkbox mr-2 checkbox-accent"
						checked={partido.saqueInicial !== "jugador1"}
						onChange={() => actualizarServicio("jugador2")}
					/>
					<div className="text-center">
						{partido.jugador2
							? `Servicio ${partido.jugador2}`
							: "Servicio Jugador 2"}
					</div>
				</div>
			</div>

			{/* Datos de Partido */}
			<div className="collapse-arrow collapse bg-base-100">
				<input type="checkbox" />
				<div className="collapse-title font-semibold">Datos de partido</div>
				<div className="collapse-content">
					<div className="flex flex-col justify-start">
						<div className="flex justify-center p-2">
							<input
								type="checkbox"
								className="checkbox mr-2 checkbox-secondary"
								checked={partido.dobles === true}
								onChange={() =>
									setPartido((prev: Partido) => {
										const partidoActualizado = {
											...prev,
											dobles: !partido.dobles,
											categoria: "Selecciona Categoría",
										};
										actualizaServidor(partidoActualizado);
										return partidoActualizado;
									})
								}
							/>
							<div className="text-center ">Es partido de dobles</div>
						</div>
						<div className="flex justify-center p-2">
							<input
								type="checkbox"
								className="checkbox mr-2 checkbox-secondary"
								checked={partido.liga === true}
								onChange={() =>
									setPartido((prev: Partido) => {
										const partidoActualizado = {
											...prev,
											liga: !partido.liga,
											categoria: "Selecciona Categoría",
										};
										actualizaServidor(partidoActualizado);
										return partidoActualizado;
									})
								}
							/>
							<div className="text-center ">Es partido de liga</div>
						</div>
						<div className="flex justify-center m-2">
							{partido.dobles ? (
								<select
									className="select"
									value={partido.categoria}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												categoria: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								>
									<option disabled defaultValue={partido.categoria}>
										Selecciona Categoría
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Dobles Mixto",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Dobles Mixto
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Dobles Femenino",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Dobles Femenino
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Dobles Masculino",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Dobles Masculino
									</option>
								</select>
							) : partido.liga ? (
								<select
									className="select"
									value={partido.categoria}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												categoria: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								>
									<option disabled defaultValue={"Selecciona categoría"}>
										Selecciona Categoría
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Individual Masculino 1",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Individual Masculino 1
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Individual Femenino 1",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Individual Femenino 1
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Individual Masculino 2",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Individual Masculino 2
									</option>
									<option
										onClick={() =>
											setPartido((prev: Partido) => {
												const partidoActualizado = {
													...prev,
													categoria: "Individual Femenino 2",
												};
												actualizaServidor(partidoActualizado);
												return partidoActualizado;
											})
										}
									>
										Individual Femenino 2
									</option>
								</select>
							) : (
								<select
									className="select"
									value={partido.categoria}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												categoria: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								>
									<option disabled={true}>Selecciona Categoría</option>
									<option>Individual Masculino</option>
									<option>Individual Femenino</option>
								</select>
							)}
						</div>
						<div className="flex justify-center">
							<fieldset className="fieldset min-w-[20rem] max-w-[20rem]">
								<legend className="fieldset-legend">
									{partido.dobles ? "Primer Jugador Pareja 1" : "Jugador 1"}
								</legend>
								<input
									type="text"
									className="input"
									placeholder={
										partido.dobles
											? "Nombre Primer Jugador Pareja 1"
											: "Nombre Jugador 1"
									}
									value={partido.jugador1}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												jugador1: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								/>
								{partido.dobles && (
									<div>
										<legend className="fieldset-legend">
											Segundo Jugador Pareja 1
										</legend>
										<input
											type="text"
											className="input"
											placeholder="Nombre Segundo Jugador Pareja 1"
											value={partido.parejaJugador1}
											onChange={(e) =>
												setPartido((prev: Partido) => {
													const partidoActualizado = {
														...prev,
														parejaJugador1: e.target.value,
													};
													actualizaServidor(partidoActualizado);
													return partidoActualizado;
												})
											}
										/>{" "}
									</div>
								)}

								<legend className="fieldset-legend">
									{partido.dobles ? "Equipo Pareja 1" : "Equipo Jugador 1"}
								</legend>
								<input
									type="text"
									className="input"
									placeholder={
										partido.dobles
											? "Nombre Equipo Pareja 1"
											: "Nombre Equipo Jugador 1"
									}
									value={partido.jugador1Equipo}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												jugador1Equipo: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								/>
								<legend className="fieldset-legend">
									{partido.dobles ? "Primer Jugador Pareja 2" : "Jugador 2"}
								</legend>
								<input
									type="text"
									className="input"
									placeholder={
										partido.dobles
											? "Nombre Primer Jugador Pareja 2"
											: "Nombre Jugador 2"
									}
									value={partido.jugador2}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												jugador2: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								/>
								{partido.dobles && (
									<div>
										<legend className="fieldset-legend">
											Segundo Jugador Pareja 2
										</legend>
										<input
											type="text"
											className="input"
											placeholder="Nombre Segundo Jugador Pareja 2"
											value={partido.parejaJugador2}
											onChange={(e) =>
												setPartido((prev: Partido) => {
													const partidoActualizado = {
														...prev,
														parejaJugador2: e.target.value,
													};
													actualizaServidor(partidoActualizado);
													return partidoActualizado;
												})
											}
										/>{" "}
									</div>
								)}
								<legend className="fieldset-legend">
									{partido.dobles ? "Equipo Pareja 2" : "Equipo Jugador 2"}
								</legend>
								<input
									type="text"
									className="input"
									placeholder={
										partido.dobles ? "Equipo Pareja 2" : "Equipo Jugador 2"
									}
									value={partido.jugador2Equipo}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												jugador2Equipo: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								/>
								<legend className="fieldset-legend">Nombre Torneo</legend>
								<input
									type="text"
									className="input"
									placeholder="Nombre torneo"
									value={partido.nombreTorneo}
									onChange={(e) =>
										setPartido((prev: Partido) => {
											const partidoActualizado = {
												...prev,
												nombreTorneo: e.target.value,
											};
											actualizaServidor(partidoActualizado);
											return partidoActualizado;
										})
									}
								/>
								<p className="fieldset-label">
									Opcional (Título de marcador si no es partido de liga)
								</p>
								{partido.liga && (
									<div>
										<legend className="fieldset-legend">
											Resultado Provisional Partido Liga
										</legend>
										<div className="flex justify-between">
											<legend className="fieldset-legend pr-2 w-4/12">
												{partido.jugador1Equipo
													? partido.jugador1Equipo
													: "Equipo 1"}
											</legend>
											<input
												type="number"
												className="input w-2/12"
												placeholder={"0"}
												value={partido.resultadoEquipo1}
												onChange={(e) =>
													setPartido((prev: Partido) => {
														const partidoActualizado = {
															...prev,
															resultadoEquipo1: e.target.value,
														};
														actualizaServidor(partidoActualizado);
														return partidoActualizado;
													})
												}
											/>
											<legend className="fieldset-legend p-2 w-4/12">
												{partido.jugador2Equipo
													? partido.jugador2Equipo
													: "Equipo 2"}
											</legend>
											<input
												type="number"
												className="input w-2/12"
												placeholder="0"
												value={partido.resultadoEquipo2}
												onChange={(e) =>
													setPartido((prev: Partido) => {
														const partidoActualizado = {
															...prev,
															resultadoEquipo2: e.target.value,
														};
														actualizaServidor(partidoActualizado);
														return partidoActualizado;
													})
												}
											/>
										</div>
										<p className="fieldset-label">
											Opcional (Resultado que aparecerá si es partido de liga)
										</p>
									</div>
								)}
							</fieldset>
						</div>
					</div>
				</div>
			</div>
			{/* Imágenes */}
			<div className="collapse-arrow collapse bg-base-100">
				<input type="checkbox" />
				<div className="collapse-title font-semibold">Imágenes</div>
				<div className="collapse-content flex justify-center">
					<div className="flex flex-col items-center p-2">
						<label className="text-md font-bold">
							{partido.jugador1Equipo
								? `Escudo ${partido.jugador1Equipo}`
								: "Escudo 1"}
						</label>
						<label className="cursor-pointer">
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleImageUpload(e, 1)}
								className="hidden"
							/>
							<div className="w-24 h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400 hover:bg-gray-100 transition">
								{partido.escudoEquipo1 ? (
									<img
										src={partido.escudoEquipo1}
										alt="Preview"
										className="w-full h-full object-contain rounded-lg"
									/>
								) : (
									<ImagePlus className="w-10 h-10 text-gray-600" />
								)}
							</div>
						</label>
					</div>
					<div className="flex flex-col items-center p-2">
						<label className="text-md font-bold">
							{partido.jugador2Equipo
								? `Escudo ${partido.jugador2Equipo}`
								: "Escudo 2"}
						</label>
						<label className="cursor-pointer">
							<input
								type="file"
								accept="image/*"
								onChange={(e) => handleImageUpload(e, 2)}
								className="hidden"
							/>
							<div className="w-24 h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400 hover:bg-gray-100 transition">
								{partido.escudoEquipo2 ? (
									<img
										src={partido.escudoEquipo2}
										alt="Preview"
										className="w-full h-full object-contain rounded-lg"
									/>
								) : (
									<ImagePlus className="w-10 h-10 text-gray-600" />
								)}
							</div>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PartidoPage;
