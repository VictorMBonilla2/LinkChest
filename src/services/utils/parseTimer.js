/**
 * @param {string} timer
 * @returns {string}
 */
export default function parseTimer(timer) {
  const mapa = {
    ninguno: "Sin recordatorio.",
    diario: "Cada día.",
    semanal: "Cada semana.",
    mensual: "Cada mes.",
  };

  // Normalizar y devolver valor
  return mapa[timer?.toLowerCase?.()] || "Desconocido";
}