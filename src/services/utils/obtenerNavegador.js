
export default function obtenerNavegador() {
    const ua = navigator.userAgent;

    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg/")) return "Microsoft Edge";
    if (ua.includes("Chrome") && !ua.includes("Edg/") && !ua.includes("OPR/")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
    if (ua.includes("Brave")) return "Brave";

    return "Desconocido";
}
