import { DELETE, GET, POST, PUT } from "@/config/API";
import { DataFetch } from "./utils/dataFetch";
import { parseResponse } from "./utils/parseResponse";





export async function obtenerCarpetasWithContentByUser() {

    const data = new DataFetch("api/carpetas/userLinks")

    try {
        const response = await GET(data);
        const resultado = await parseResponse(response)
        if (!resultado.ok) {
            console.error("Hubo un error al obtener las carpetas del usuario:", response.statusText );
            return []
        }

        
        return resultado.data.carpetas
    } catch (error) {
        console.error("Hubo un error al obtener las carpetas del usuario", error);
        return []
    }


}
export async function obtenerCarpetasByUser() {

    const data = new DataFetch("api/carpetas/user")
    try {
        const response = await GET(data);
        const resultado = await parseResponse(response)
        if (!resultado.ok) {
            console.error("Hubo un error al obtener las carpetas del usuario:", response.statusText );
            return []
        }
        
        return resultado.data.list
    } catch (error) {
        console.error("Hubo un error al obtener las carpetas del usuario", error);
        return []
    }

}

export async function crearCarpeta(nombreCarpeta) {

    const data = new DataFetch("api/carpetas/add", {nombre: nombreCarpeta})

    try {
        const response = await POST(data)
        const resultado = await parseResponse(response)
        if (!resultado.ok) {
            console.error("Hubo un error al crear la carpeta del usuario:", response.statusText );
            return {ok: false }
        }
        alert("Carpeta creada correctamente.")
        return {ok: true, newCarpeta: resultado.data.newCarpeta}
    } catch (error) {
        console.error("Hubo un error al crear la carpeta del usuario", error);
        return {ok: false }
    }

    
}
export async function editarCarpeta(nombreCarpeta, idCarpeta) {

    const data = new DataFetch("api/carpetas/edit", {nombre: nombreCarpeta, idCarpeta: idCarpeta})
    
    try {
        const response = await PUT(data)
        const resultado = await parseResponse(response)
        if (!resultado.ok) {
            console.error(`Hubo un error al editar la carpeta del usuario. ${resultado.statusText}: ${resultado.data.error}`);
            return {ok: false }
        }
        alert("Carpeta editada correctamente.")
        return {ok: true, editedCarpeta: resultado.data.carpeta}
    } catch (error) {
        console.error("Hubo un error inesperado en la solicitud de editar la carpeta del usuario", error);

        return {ok: false }
    }

    
}

export async function eliminarCarpeta(idCarpeta) {
    
    const data = new DataFetch(`api/carpetas/delete/${idCarpeta}`)
    
    try {
        const response = await DELETE(data)
        const resultado = await parseResponse(response)
        if (!resultado.ok) {
            console.error(`Hubo un error al eliminar la carpeta del usuario. ${resultado.statusText}: ${resultado.data.error}`);
            return {ok: false }
        }
        alert("Carpeta eliminada correctamente.")
        return {ok: true, deletedCarpeta: resultado.data.carpeta}
    } catch (error) {
        console.error("Hubo un error inesperado en la solicitud de eliminar la carpeta del usuario", error);

        return {ok: false }
    }

    
}