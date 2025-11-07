import { diasMap, INTERVALO_BASE } from "./config/ConstRecordatorio.js";
import { obtenerRecordatorios, insertarClickEnlace, actualizarEnlaceAviso, registrarAnalitica, actualizarAnaliticaClick } from "./services/Enlaces.js";


// background.js
const MS_DIA = 24 * 60 * 60 * 1000;
const notificacionesMap = {}; // id -> enlace



//--------------------
// Constantes y utilidades
//--------------------

const MARGEN_AVISO_MS = 30 * 60 * 1000; // 30 minutos

function yaFueNotificado(enlace, ahora) {
  return enlace.ultimoAviso && Math.abs(ahora - enlace.ultimoAviso) < MARGEN_AVISO_MS;
}

/**
 * @typedef {import('./services/utils/tipos.js').EnlaceActivo} EnlaceActivo
*/

async function obtenerUsuarioActual() {
  const  idUser  = await chrome.storage.local.get("userActive");
  return idUser || null; // debe contener el _id o identificador del usuario logueado
}


// --------------------
// Instalación y alarma periódica
// --------------------
chrome.runtime.onInstalled.addListener(() => {
  console.log("⏰ Recordador de enlaces instalado.");
  chrome.alarms.create("verificarAvisos", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "verificarAvisos") {
    console.log("Alerta de Verificar Avisos recibida...⏰ ");
    await verificarRecordatorios();
  }
});

// --------------------
// Verificar recordatorios
// --------------------
async function verificarRecordatorios() {
  try {
    const enlaces = await obtenerEnlacesActivos();
    const stored = await chrome.storage.local.get(null);
    const ahora = Date.now();

    const usuarioActual = await obtenerUsuarioActual();

    for (let enlace of enlaces) {
      // 🔹 Limpiar si ya no tiene recordatorio activo
      if (enlace.tipoRecordatorio === "ninguno") {
        await chrome.storage.local.remove(enlace._id);
        console.log(`🧹 Enlace ${enlace._id} eliminado del almacenamiento local (sin recordatorio).`);
        continue;
      }

      // 🔹 Combinar con versión local (si existe)
      if (stored[enlace._id]) {
        enlace = { ...enlace, ...stored[enlace._id] };
      }

      // 🔹 Comprobar si pertenece al usuario actual
      enlace.AvisoHabilitado = usuarioActual && enlace.usuarioId === usuarioActual;

      // Guardar siempre el estado local actualizado
      await chrome.storage.local.set({ [enlace._id]: enlace });

      // 🔹 Si el aviso no está habilitado, ignorar
      if (!enlace.AvisoHabilitado) {
        console.log(`⛔ Enlace ${enlace._id} pertenece a otro usuario. Ignorado.`);
        continue;
      }

      // 🔹 Procesamiento según tipo
      if (enlace.tipoRecordatorio === "preciso") {
        procesarPreciso(enlace, ahora);
      } else if (enlace.tipoRecordatorio === "inteligente") {
        procesarInteligente(enlace, ahora);
      }
    }

    // 🔹 Limpieza adicional: eliminar del storage cualquier enlace huérfano (no en la lista actual)
    const idsActuales = new Set(enlaces.map(e => e._id));

    for (const key in stored) {
      // Evita borrar configuraciones o tokens
      console.log(key);
      
      if (["jwtAuth", "userActive", "config", "preferencias"].includes(key)) continue;

      // Elimina solo si no pertenece a un enlace activo
      if (!idsActuales.has(key)) {
        await chrome.storage.local.remove(key);
        console.log(`🧹 Eliminado ${key} del almacenamiento (ya no está activo).`);
      }
    }

  } catch (err) {
    console.error("Error al verificar recordatorios:", err);
  }
}


// --------------------
// Función para obtener enlaces activos desde backend
// --------------------


/**
 * Obtiene la lista de enlaces activos almacenados.
 *
 * @async
 * @function obtenerEnlacesActivos
 * @returns {Promise<EnlaceActivo[]>} Devuelve una lista de objetos tipo `EnlaceActivo`,
 * o una lista vacía si no hay resultados o ocurre un error.
 */
async function obtenerEnlacesActivos() {
  try {
    const data = await obtenerRecordatorios();
    console.log(data);
    
    return data || [];
  } catch (err) {
    console.error("Error trayendo enlaces activos:", err);
    return [];
  }
}

// --------------------
// Procesamiento preciso
// --------------------

/**
 * Procesa un enlace con recordatorio de tipo "preciso".
 * Evalúa si debe mostrarse una notificación según el día y hora configurados,
 * y actualiza la programación del próximo aviso.
 *
 * Campos relevantes: `diasSeleccionados`, `horaRecordatorio`, `ultimoAviso`, `proximoAviso`
 *
 * @param {EnlaceActivo} enlace - Enlace con configuración de recordatorio preciso.
 * @param {number} ahora - Timestamp actual (valor de `Date.now()`).
 */
function procesarPreciso(enlace, ahora) {
  if (!enlace.diasSeleccionados || !enlace.horaRecordatorio) return;

  const diaSemana = new Date(ahora).getDay(); // 0 = domingo ... 6 = sábado
  const hoy = diasMap[diaSemana];

  // Solo proceder si el día actual está dentro de los días seleccionados
  if (!enlace.diasSeleccionados.includes(hoy)) return;

  // Crear un objeto Date con la hora configurada
  const [hora, minuto] = enlace.horaRecordatorio.split(":").map(Number);
  const avisoTime = new Date();
  avisoTime.setHours(hora, minuto, 0, 0);

  // Verificar si ya fue notificado recientemente
  if (yaFueNotificado(enlace, ahora)) return;

  // Si la hora del recordatorio ya pasó, mostrar notificación
  if (ahora >= avisoTime.getTime()) {
    mostrarNotificacion(enlace);

    // Calcular y guardar el próximo aviso
    const proximoAviso = calcularProximoAvisoPreciso(enlace, avisoTime);
    actualizarProximoAviso(enlace, avisoTime.getTime(), proximoAviso);
  }
}

function calcularProximoAvisoPreciso(enlace, fechaActualAviso) {
  const fecha = new Date(fechaActualAviso);
  let siguienteDia = null;

  // Encuentra el siguiente día válido en los seleccionados
  for (let i = 1; i <= 7; i++) {
    const dia = diasMap[(fecha.getDay() + i) % 7];
    if (enlace.diasSeleccionados.includes(dia)) {
      siguienteDia = i;
      break;
    }
  }

  if (siguienteDia === null) return null;

  const [hora, minuto] = enlace.horaRecordatorio.split(":").map(Number);
  const proximo = new Date(fechaActualAviso);
  proximo.setDate(fecha.getDate() + siguienteDia);
  proximo.setHours(hora, minuto, 0, 0);

  return proximo.getTime();
}


// --------------------
// Procesamiento inteligente
// --------------------

/**
 * Procesa un enlace con recordatorio de tipo "inteligente".
 * Determina si debe mostrarse una notificación según la frecuencia e historial de avisos.
 *
 * Campos relevantes: `frecuencia`, `ultimoAviso`, `avisosHoy`, `proximoAviso`
 *
 * @param {EnlaceActivo} enlace - Enlace con configuración de recordatorio inteligente.
 * @param {number} ahora - Timestamp actual (valor de `Date.now()`).
 */
function procesarInteligente(enlace, ahora) {
  if (!enlace.frecuencia) return;
  if (yaFueNotificado(enlace, ahora)) return;

  // Intervalos mínimos entre avisos según frecuencia
  const UMBRAL_TIEMPO = {
    baja: 8 * 60 * 60 * 1000,   // 8 horas
    normal: 4 * 60 * 60 * 1000, // 4 horas
    alta: 2 * 60 * 60 * 1000,   // 2 horas
  };

  // Respetar el intervalo mínimo entre avisos
  if (enlace.ultimoAviso && (ahora - enlace.ultimoAviso < UMBRAL_TIEMPO[enlace.frecuencia])) return;

  let avisosHoy = enlace.avisosHoy || 0;

  switch (enlace.frecuencia) {
    case "baja":
      if (avisosHoy >= 1) return; // Máx. 1 aviso/día (simplificado)
      break;
    case "normal":
      if (avisosHoy >= 1) return; // Máx. 1 aviso/día
      break;
    case "alta":
      if (avisosHoy >= 3) return; // Máx. 3 avisos/día
      break;
  }

  mostrarNotificacion(enlace);


  const proximoAviso = calcularProximoAvisoInteligente(enlace, ahora);
  enlace.avisosHoy = avisosHoy + 1;

  actualizarProximoAviso(enlace, ahora, proximoAviso);
}

function calcularProximoAvisoInteligente(enlace, ahora) {
  return ahora + INTERVALO_BASE[enlace.frecuencia];
}


// --------------------
// Mostrar notificación y registrar click
// --------------------
async function mostrarNotificacion(enlace) {
  const id = "enlace_" + enlace._id;
  if (notificacionesMap[id]) return; // ya existe
  notificacionesMap[id] = enlace;

  await registrarAnalitica({
  enlaceId: enlace._id,
  tipoRecordatorio: enlace.tipoRecordatorio,
  intensidadRecordatorio: enlace.frecuencia || enlace.intensidadRecordatorio,
  origen: "chrome",
  });
  chrome.notifications.create(id, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("logo.png"),
    title: "🔔 Recordatorio de Enlace",
    message: `Tienes pendiente: ${enlace.titulo}`,
    contextMessage: "Haz clic para abrir el enlace",
    priority: 2,
  });
}

// Manejo click de notificación
chrome.notifications.onClicked.addListener(async (id) => {
  const enlace = notificacionesMap[id];
  if (!enlace) return;

  chrome.tabs.create({ url: enlace.url });
  chrome.notifications.clear(id);
  delete notificacionesMap[id];

  // Reportar al backend que fue presionada
  try {
    await insertarClickEnlace(enlace._id);
    await actualizarAnaliticaClick(enlace._id);
  } catch (err) {
    console.error("No se pudo reportar la notificación:", err);
  }
});

// --------------------
// Actualizar proximo aviso
// --------------------
async function actualizarProximoAviso(enlace, timestamp, proximoAviso) {
  try {
    const update = {
      ultimoAviso: timestamp,
      proximoAviso: proximoAviso || null,
    };

    if (enlace.tipoRecordatorio === "inteligente") {
      update.avisosHoy = (enlace.avisosHoy || 0) + 1;
    }

    // --- 1️⃣ Actualización en backend
    await actualizarEnlaceAviso(enlace._id, update);

    // --- 2️⃣ Actualización en almacenamiento local
    const newData = { ...enlace, ...update };
    await chrome.storage.local.set({ [enlace._id]: newData });

    console.log(`✅ Enlace ${enlace._id} actualizado con próximo aviso:`, new Date(update.proximoAviso));
  } catch (err) {
    console.error("Error actualizando aviso:", err);
  }
}
