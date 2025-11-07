import { GET, POST, PUT, DELETE, PATCH } from "@/config/API";
import { DataFetch } from "./utils/dataFetch";
import { parseResponse } from "./utils/parseResponse";
import { storage } from "./utils/storage.js";
import obtenerNavegador from "./utils/obtenerNavegador";
import { diasMap, INTERVALO_BASE } from "@/config/ConstRecordatorio";

/**
 * @typedef {import('./utils/tipos.js').EnlaceActivo} EnlaceActivo
*/

export async function obtenerEnlacesbySearch(search, tagsSelected, currentPage) {
    /**
     * Parametros de busqueda: Texto Typeado y Tags 
     */
    const data = {
        url: `api/enlaces?search=${search}&tags=${tagsSelected}&page=${currentPage}`,

    }

    try {
        const response = await GET(data)
        if (response.ok) {
            const body = await response.json()

            return body

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return [];
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return []; // para que siempre devuelva algo
    }

}

/**
 * @typedef {Object} DataEnlace
 * @property {string} nombre - Titulo del enlace
 * @property {string} url - Url del enlace
 * @property {number} carpetaID - (Opcional) ID de la carpeta en la que se asocia el enlace. 
 * @property {string} timer - (opcional) Intervalo de tiempo de recordatorio
 * @property {string[]} [tags] - (opcional) Lista opcional de etiquetas asociadas
 */
export async function crearEnlace(DataEnlace) {

    const navegador = obtenerNavegador();

    // 🧩 Añadir el navegador al cuerpo del request
    const data = new DataFetch("api/enlaces/", {
        ...DataEnlace,
        navegador
    });

    try {
        const response = await POST(data);
        const result = await parseResponse(response)

        if (result.ok) {

            agendarNuevaNotificacion(result.data.enlace)
            alert("Enlace añadido correctamente");
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            alert(result.data.error);
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
    }   

}


export async function editarEnlace(DataEnlace) {
    const navegador = obtenerNavegador();


    const data = new DataFetch(`api/enlaces/user/${DataEnlace.id}`, { ...DataEnlace, navegador });
    try {
        const response = await PUT(data);
        const result = await parseResponse(response)

        if (result.ok) {
            alert("Enlace Actualizado correctamente");
            actualizarNotificacionExistente(result.data.enlace)
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
    }
}

/**
 * 
 * @param {String} idEnlace - ID del enlace a eliminar
 */
export async function eliminarEnlace(idEnlace) {

    const data = new DataFetch(`api/enlaces/delete?id=${idEnlace}`)

    try {

        const response = await DELETE(data)
        const result = await parseResponse(response)

        if (result.ok) {
            alert("Enlace eliminado Correctamente")
            eliminarNotificacionExistente(result.data.idEnlace)
            return true
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }

}

export async function obtenerEnlacesByID(idEnlace) {


    const data = new DataFetch(`api/enlaces/user/${idEnlace}`)

    try {
        const response = await GET(data)
        const result = await parseResponse(response)

        if (result.ok) {
            return result.data.enlace
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }
}


export async function obtenerRecordatorios() {
    const data = new DataFetch(`api/enlaces/user/recordatorio`)

    try {
        const response = await GET(data)
        const result = await parseResponse(response)

        if (result.ok) {
            return result.data.enlaces || [];
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }

}


export async function insertarClickEnlace(idEnlace) {
    const data = new DataFetch(`api/enlaces/user/click`, { idEnlace: idEnlace })
    try {
        const response = await POST(data)
        const result = await parseResponse(response)

        if (result.ok) {
            return true
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }
}
export async function actualizarAnaliticaClick(idEnlace) {
    const data = new DataFetch(`api/analiticas/enlaces/actualizarClick`, { idEnlace: idEnlace })
    try {
        const response = await PATCH(data)
        const result = await parseResponse(response)

        if (result.ok) {
            return true
        } else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }

    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }
}





export async function actualizarEnlaceAviso(idEnlace, Enlace) {


    const data = new DataFetch(`api/enlaces/user/ultimoAviso`, { idEnlace: idEnlace, ...Enlace })

    try {
        const response = await PATCH(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true
        }
        else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }
    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }
}

// --------------------
// WEBENDPOINS
// --------------------


export const sudoObtenerEnlacesPaginado = async (search,currentPage )=>{

   
    const data = new DataFetch(`api/sudo/enlaces/all?search=${search}&page=${currentPage}` );

    try {
        const response = await GET(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return result.data

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return [];
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return []; // para que siempre devuelva algo
    }

}

export const sudoDesactivarEnlace = async (idEnlace) =>{
     const data = new DataFetch(`api/sudo/enlaces/desactivate?idEnlace=${idEnlace}` );

    try {
        const response = await PATCH(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return [];
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return []; // para que siempre devuelva algo
    }
}
export const sudoActivarEnlace = async (idEnlace) =>{
     const data = new DataFetch(`api/sudo/enlaces/activate?idEnlace=${idEnlace}` );

    try {
        const response = await PATCH(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return [];
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return []; // para que siempre devuelva algo
    }
}

export const sudoEliminarEnlace = async (idEnlace) =>{
     const data = new DataFetch(`api/sudo/enlaces?idEnlace=${idEnlace}` );

    try {
        const response = await DELETE(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return [];
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return []; // para que siempre devuelva algo
    }
}















// --------------------
// NOTIFICACIONES
// --------------------
export const registrarAnalitica = async (Enlace) => {
    const data = new DataFetch(`api/analiticas/enlaces/registrarAnaliticaEnlace`, { ...Enlace })

    try {
        const response = await POST(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true
        }
        else {
            console.warn(
                "Error en la respuesta:",
                result.status,
                result.statusText, ": ",
                result.data.error
            );
            return false
        }
    } catch (error) {
        console.error("Hubo un error:", error.message);
        return false
    }
};




export const obtenerEnlacesConRecordatoriosLocal = async () => {
  // Obtener todo el almacenamiento local
  const data = await chrome.storage.local.get();

  // Regex para validar IDs de Mongo (24 caracteres hexadecimales)
  const mongoRegex = /^[0-9a-fA-F]{24}$/;

  // Filtrar por claves que sean ObjectId y extraer sus valores
  const lista = Object.entries(data) // ← ✅ corregido
    .filter(([key]) => mongoRegex.test(key)) // ← Filtra por la KEY
    .map(([key, value]) => ({
      _id: key,
      ...value
    })); // ← Devuelve el objeto con su id

  console.log("Recordatorios válidos:", lista);
  return lista;
};


/**
 * Construye una versión normalizada de un objeto de enlace para su almacenamiento local.
 * Garantiza que todos los campos requeridos por `EnlaceActivo` estén presentes.
 *
 * @param {Partial<EnlaceActivo>} enlace - Objeto de enlace original o parcial.
 * @returns {EnlaceActivo} Objeto de enlace normalizado y consistente.
 */
function construirEnlaceActivo(enlace) {
  const ahora = new Date().toISOString();

  return {
    _id: enlace._id,
    titulo: enlace.titulo,
    url: enlace.url,
    tipoRecordatorio: enlace.tipoRecordatorio || "preciso",
    diasSeleccionados: enlace.diasSeleccionados || [],
    horaRecordatorio: enlace.horaRecordatorio || null,
    frecuencia: enlace.frecuencia || "normal",
    avisosHoy: enlace.avisosHoy ?? 0,
    fechaUltimoAvisoReseteo: enlace.fechaUltimoAvisoReseteo || ahora,
    fechaUltimaActualizacion: ahora,
    ultimoAviso: enlace.ultimoAviso || null,
    proximoAviso: enlace.proximoAviso || null,
  };
}


/**
 * Agenda un nuevo recordatorio para un enlace activo.
 * Crea una copia normalizada del enlace, calcula su próximo aviso
 * y lo almacena en `chrome.storage.local`.
 *
 * @async
 * @param {Partial<EnlaceActivo>} enlace - Datos del enlace a registrar.
 * @returns {Promise<EnlaceActivo>} Devuelve el enlace con su `proximoAviso` calculado.
 */
async function agendarNuevaNotificacion(enlace) {
  try {
    const nuevoEnlace = construirEnlaceActivo(enlace);

    // Calcular el primer aviso según el tipo de recordatorio
    const proximoAviso = calcularProximoAvisoInicial(nuevoEnlace);

    // Guardar en almacenamiento local
    await storage.set({
      [nuevoEnlace._id]: { ...nuevoEnlace, proximoAviso },
    });

    console.log(`✅ Enlace "${nuevoEnlace.titulo}" agendado correctamente.`);
    return { ...nuevoEnlace, proximoAviso };
  } catch (err) {
    console.error("❌ Error al agendar notificación:", err);
    throw err;
  }
}


/**
 * Elimina un recordatorio existente despues de la eliminación de su enlace.
 *
 * @async
 * @param {Partial<EnlaceActivo>} idEnlace - ID del enlace eliminado.
 * @returns {Promise<void>}
 */

async function eliminarNotificacionExistente(idEnlace) {
  try {
    await storage.remove(idEnlace);
    console.log(`🗑️ Enlace "${idEnlace}" eliminado del almacenamiento.`);
  } catch (err) {
    console.error("❌ Error al eliminar la notificación:", err);
    throw err;
  }
}


/**
 * Actualiza un recordatorio existente o lo elimina si su tipo es "ninguno".
 *
 * @async
 * @param {Partial<EnlaceActivo>} enlace - Enlace con información actualizada.
 * @returns {Promise<void>}
 */
async function actualizarNotificacionExistente(enlace) {
  try {
    // Si el usuario desactivó el recordatorio, eliminar del almacenamiento
    if (enlace.tipoRecordatorio === "ninguno") {
        console.log(enlace);
        
      await storage.remove(enlace._id);
      console.log(`🗑️ Enlace "${enlace.titulo}" eliminado del almacenamiento.`);
      return;
    }

    // Caso contrario, actualizarlo normalmente
    const enlaceActualizado = construirEnlaceActivo(enlace);
    const proximoAviso = calcularProximoAvisoInicial(enlaceActualizado);

    await storage.set({
      [enlaceActualizado._id]: { ...enlaceActualizado, proximoAviso },
    });

    console.log(`🔄 Enlace "${enlaceActualizado.titulo}" actualizado correctamente.`);
  } catch (err) {
    console.error("❌ Error al actualizar notificación:", err);
    throw err;
  }
}


// --------------------
// Calcular el primer próximo aviso según tipo
// --------------------

function calcularProximoAvisoInicial(enlace) {
  const ahora = Date.now();

  if (enlace.tipoRecordatorio === "preciso") {
    return calcularProximoAvisoPreciso(enlace, ahora);
  } else if (enlace.tipoRecordatorio === "inteligente") {
    return calcularProximoAvisoInteligente(enlace, ahora);
  }

  return null;
}

// --------------------
// Calcular proximo aviso para recordatorios precisos
// --------------------
function calcularProximoAvisoPreciso(enlace, ahora) {
  if (!enlace.diasSeleccionados?.length || !enlace.horaRecordatorio) return null;

  const fechaActual = new Date(ahora);
  const [hora, minuto] = enlace.horaRecordatorio.split(":").map(Number);

  // Buscar el próximo día válido
  for (let i = 0; i < 7; i++) {
    const futuraFecha = new Date(fechaActual);
    futuraFecha.setDate(fechaActual.getDate() + i);
    const dia = diasMap[futuraFecha.getDay()];

    if (enlace.diasSeleccionados.includes(dia)) {
      futuraFecha.setHours(hora, minuto, 0, 0);
      if (futuraFecha.getTime() > ahora) return futuraFecha.getTime();
    }
  }

  return null; // no hay día futuro válido
}

// --------------------
// Calcular proximo aviso para recordatorios inteligentes
// --------------------
function calcularProximoAvisoInteligente(enlace, ahora) {

  return ahora + (INTERVALO_BASE[enlace.frecuencia] || INTERVALO_BASE.normal);
}


