export interface SetPuntuacion {
	jugador1: number;
	jugador2: number;
}
export interface PartidoProps {
	jugador1: string;
	setJugador1: React.Dispatch<React.SetStateAction<string>>;
	jugador2: string;
	setJugador2: React.Dispatch<React.SetStateAction<string>>;
	parejaJugador1: string;
	setParejaJugador1: React.Dispatch<React.SetStateAction<string>>;
	parejaJugador2: string;
	setParejaJugador2: React.Dispatch<React.SetStateAction<string>>;
	jugador1Equipo: string;
	setJugador1Equipo: React.Dispatch<React.SetStateAction<string>>;
	jugador2Equipo: string;
	setJugador2Equipo: React.Dispatch<React.SetStateAction<string>>;
	resultadoEquipo1: string;
	setResultadoEquipo1: React.Dispatch<React.SetStateAction<string>>;
	resultadoEquipo2: string;
	setResultadoEquipo2: React.Dispatch<React.SetStateAction<string>>;
	setIndex: number;
	escudoEquipo1: string | null;
	setEscudoEquipo1: React.Dispatch<React.SetStateAction<string>>;
	escudoEquipo2: string | null;
	setEscudoEquipo2: React.Dispatch<React.SetStateAction<string>>;
	setSetIndex: React.Dispatch<React.SetStateAction<number>>;
	saqueInicial: string;
	setSaqueInicial: React.Dispatch<React.SetStateAction<string>>;
	categoria: string;
	setCategoria: React.Dispatch<React.SetStateAction<string>>;
	nombreTorneo: string;
	setNombreTorneo: React.Dispatch<React.SetStateAction<string>>;
	saqueActual: string;
	setSaqueActual: React.Dispatch<React.SetStateAction<string>>;
	dobles: boolean;
	setDobles: React.Dispatch<React.SetStateAction<boolean>>;
	liga: boolean;
	setLiga: React.Dispatch<React.SetStateAction<boolean>>;
	puntuacion: SetPuntuacion[];
	setPuntuacion: React.Dispatch<React.SetStateAction<SetPuntuacion[]>>;
}

export interface Partido {
	jugador1: string;
	jugador2: string;
	parejaJugador1: string;
	parejaJugador2: string;
	jugador1Equipo: string;
	jugador2Equipo: string;
	resultadoEquipo1: string;
	resultadoEquipo2: string;
	setIndex: number;
	escudoEquipo1: string | null;
	escudoEquipo2: string | null;
	saqueInicial: string;
	categoria: string;
	nombreTorneo: string;
	saqueActual: string;
	dobles: boolean;
	liga: boolean;
	puntuacion: SetPuntuacion[];
	reduced: boolean;
}
