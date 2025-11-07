import { GET } from "@/config/API";
import { DataFetch } from "./utils/dataFetch";



export async function obtenerTagsSearchByUser() {

    const data = new DataFetch("api/tags/user")

    try {
        const response = await GET(data)

        if (!response.ok) {
            console.error("Error al obtener Tags de busqueda: ", response.statusText);
            return []
        }

        const body = await response.json()
        return body

    } catch (error) {
        console.error("Error interno al obtener Tags de Busqueda: ", error)
          return []
    }
}