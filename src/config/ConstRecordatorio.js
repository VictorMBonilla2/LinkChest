
/**
 * Intervalos base (en milisegundos) para los recordatorios de tipo "inteligente",
 * según su nivel de frecuencia configurado.
 *
 * - `baja`: cada 2 días  
 * - `normal`: cada 1 día  
 * - `alta`: cada 8 horas
 *
 * @type {{ baja: number, normal: number, alta: number }}
 */
export const INTERVALO_BASE = {
  baja: 24 * 60 * 60 * 1000 * 2, // cada 2 días
  normal: 24 * 60 * 60 * 1000,   // cada día
  alta: 8 * 60 * 60 * 1000,      // cada 8 horas
};

/**
 * Mapa de los días de la semana, usado para los recordatorios de tipo "preciso".
 *
 * Índices:  
 * `0` = domingo,  
 * `1` = lunes,  
 * `2` = martes,  
 * `3` = miércoles,  
 * `4` = jueves,  
 * `5` = viernes,  
 * `6` = sábado.
 *
 * @type {string[]}
 */
export const diasMap = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];