import { GET, POST, PUT, DELETE, PATCH } from "@/config/API";
import { parseResponse } from "./utils/parseResponse";
import { DataFetch } from "./utils/dataFetch";





export async function logout() {
    const data = new DataFetch("auth/logout")
    try {
        const response = await POST(data);

        if (response.ok) {
            const body = await response.json();

            return body.user;
        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return null;
        }

    } catch (err) {
        console.error("Hubo un error:", err.message);
        return null; // para que siempre devuelva algo
    }
}

export async function loginWithGoogle(credential) {

    const data = {
        url: "auth/google",
        body: { token: credential }

    };

    try {
        const response = await POST(data);
        const result = await parseResponse(response)
        if (result.ok) {
            await tokenToStorage(result.data.token, result.data.user._id)
            return result.data.user;
        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            alert(`Error: ${result.data.error}`)
            return null;
        }

    } catch (err) {
        console.error("Hubo un error:", err.message);
        return null; // para que siempre devuelva algo
    }

}
export async function loginWithEmail(login) {
    const data = new DataFetch("auth/loginemail", { email: login.email, password: login.password })

    try {
        const response = await POST(data);
        const result = await parseResponse(response)
        if (result.ok) {

            
            await tokenToStorage(result.data.token, result.data.user._id)

            return result.data.user;
        } else {
            console.warn("Error en la respuesta:", result.status, result.statusText, result.data.error);
            alert(`Error: ${result.data.error}`)
            return null;
        }

    } catch (err) {
        console.error("Hubo un error:", err.message);
        return null; // para que siempre devuelva algo
    }
}

export async function registerWithEmail(register) {


    const data = new DataFetch("auth/registeremail", { email: register.email, password: register.password })

    try {
        const response = await POST(data);
        const result = await parseResponse(response)
        if (result.ok) {
            await tokenToStorage(result.data.token, result.data.user._id)
            alert("Registro realizado con exito!")
            return result.data;
        } else {
            console.warn("Error en la respuesta:", result.status, result.statusText, result.data.error);
                alert(`Error: ${result.data.error} `)
            return  null;
        }

    } catch (err) {
        console.error("Hubo un error:", err.message);
        return null; // para que siempre devuelva algo
    }
}

export async function validarSesion() {
    const data = {
        url: "auth/validarSesion"
    }
    try {
        const response = await GET(data)

        if (!response.ok) {
            return false
        }

        return true
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return false; // para que siempre devuelva algo
    }

}

async function tokenToStorage(token, idUser) {
    try {
        if (import.meta.env.DEV) {
            // 💾 En desarrollo, usa localStorage
            localStorage.setItem("jwtAuth", token);
        } else {
            // 🔒 En producción, usa Chrome Storage API
            await chrome.storage.local.set({ jwtAuth: token });
            await chrome.storage.local.set({ userActive: idUser });
        }
        /*
        // 🔁 (Opcional) guardar info del usuario
        if (user) {
          if (import.meta.env.MODE === "development") {
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            await chrome.storage.local.set({ user });
          }
        }
        */
    } catch (error) {
        console.error("⚠️ Error guardando sesión:", error);
    }
}


// --------------------
// WEBENDPOINS
// --------------------


export const sudoObtenerUsuariosPaginado = async (search,currentPage )=>{

   
    const data = new DataFetch(`api/sudo/usuarios/all?search=${search}&page=${currentPage}` );

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

export const sudoDesactivarUsuario = async (idUsuario) =>{
     const data = new DataFetch(`api/sudo/usuarios/desactivate?idUsuario=${idUsuario}` );

    try {
        const response = await PATCH(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return false;
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return false; // para que siempre devuelva algo
    }
}
export const sudoActivarUsuario = async (idUsuario) =>{
     const data = new DataFetch(`api/sudo/usuarios/activate?idUsuario=${idUsuario}` );

    try {
        const response = await PATCH(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return false;
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return false; // para que siempre devuelva algo
    }
}

export const sudoEliminarUsuario= async (idUsuario) =>{
     const data = new DataFetch(`api/sudo/usuarios?idUsuario=${idUsuario}` );

    try {
        const response = await DELETE(data)
        const result = await parseResponse(response)
        if (result.ok) {
            return true

        } else {
            console.warn("Error en la respuesta:", response.status, response.statusText);
            return false;
        }
    } catch (err) {
        console.error("Hubo un error:", err.message);
        return false; // para que siempre devuelva algo
    }
}






