"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Alert {
	message: string;
	type: "success" | "error" | "warning" | "info";
}

interface AlertContextType {
	alert: Alert | null;
	showAlert: (message: string, type: Alert["type"]) => void;
	hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [alert, setAlert] = useState<Alert | null>(null);

	const showAlert = (message: string, type: Alert["type"]) => {
		setAlert({ message, type });

		// Ocultar automáticamente después de 3 segundos
		setTimeout(() => setAlert(null), 3000);
	};

	const hideAlert = () => setAlert(null);

	return (
		<AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
			{children}
		</AlertContext.Provider>
	);
};

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) throw new Error("useAlert debe usarse dentro de AlertProvider");
	return context;
};
