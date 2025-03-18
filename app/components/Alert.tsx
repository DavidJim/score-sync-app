"use client";
import { useAlert } from "@/context/AlertContext";

const Alert = () => {
	const { alert, hideAlert } = useAlert();
	if (!alert) return null;
	type AlertType = "success" | "error" | "warning" | "info";
	const alertClass: string =
		{
			success: "alert-success",
			error: "alert-error",
			warning: "alert-warning",
			info: "alert-info",
		}[alert.type as AlertType] || "alert-info";

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
			<div
				role="alert"
				className={`alert ${alertClass} shadow-lg flex justify-between`}
			>
				<span>{alert.message}</span>
				<button onClick={hideAlert} className="btn btn-sm btn-ghost">
					✕
				</button>
			</div>
		</div>
	);
};

export default Alert;
