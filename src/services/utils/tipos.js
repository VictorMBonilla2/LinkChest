/**
 * Representa un enlace activo con su configuración de recordatorio.
 * Algunos campos se utilizan según el tipo de recordatorio ("preciso" o "inteligente").
 *
 * @typedef {Object} EnlaceActivo
 * @property {string} _id - Identificador único del enlace.
 * @property {string} url - Dirección URL asociada al enlace.
 * @property {string} titulo - Título descriptivo del enlace.
 * @property {string} tipoRecordatorio - Tipo de recordatorio ("preciso" o "inteligente").
 * @property {number} avisosHoy - Número de avisos emitidos en el día actual.
 * @property {string} frecuencia - Nivel de frecuencia del recordatorio ("baja", "normal", "alta").
 * @property {string[]} diasSeleccionados - Días de la semana seleccionados para el recordatorio (solo aplica para tipo "preciso").
 * @property {string} fechaUltimoAvisoReseteo - Fecha del último aviso de reseteo.
 * @property {string} fechaUltimaActualizacion - Fecha de la última actualización del enlace.
 * @property {string} horaRecordatorio - Hora establecida para emitir el recordatorio (solo aplica para tipo "preciso").
 * @property {string|null} ultimoAviso - Timestamp (ISO o epoch) del último aviso emitido.
 * @property {string|null} proximoAviso - Timestamp (ISO o epoch) programado para el próximo aviso.
 */

export {}; // <- necesario para que VS Code lo trate como módulo
