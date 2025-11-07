

export const API = import.meta.env.VITE_API_URL


// 🧠 util para obtener token según entorno
export const getAuthHeaders = async () => {
  let token = null;

  try {
    // Si estamos en entorno de desarrollo (localhost)
    if (import.meta.env.DEV) {
      token = localStorage.getItem("jwtAuth");
    } else {
      // Si estamos en extensión o entorno producción
      const stored = await chrome.storage.local.get("jwtAuth");
      token = stored.jwtAuth;
    }

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`
    };
  } catch (err) {
    console.error("Error al obtener token:", err);
    return {};
  }
};




//Maneja todas las solicitudes GET aplicables dentro del los servicios
export async function GET (data){
const authGuard = await getAuthHeaders();
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...authGuard,
      ...data.headers, // Agregar encabezados personalizados
    };

    return await fetch(`${API}/${data.url}`,{
    method: "GET",
    credentials: "include",
    headers:finalHeaders
    });
}

//Maneja todas las solicitudes POST aplicables dentro del los servicios
export async function POST (data){
const authGuard = await getAuthHeaders();
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...authGuard,
      ...data.headers, // Agregar encabezados personalizados
    };

    return await fetch(`${API}/${data.url}`,{
    body: data.body ? JSON.stringify(data.body) : null,
    method: "POST",
    credentials: "include",
    headers:finalHeaders
    });
}
//Maneja todas las solicitudes PUT aplicables dentro del los servicios
export async function PUT (data){
const authGuard = await getAuthHeaders();
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...authGuard,
      ...data.headers, // Agregar encabezados personalizados
    };

    return await fetch(`${API}/${data.url}`,{
    body: data.body ? JSON.stringify(data.body) : null,
    method: "PUT",
    credentials: "include",
    headers:finalHeaders
    });
}
//Maneja todas las solicitudes DELETE aplicables dentro del los servicios
export async function DELETE (data){
const authGuard = await getAuthHeaders();
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...authGuard,
      ...data.headers, // Agregar encabezados personalizados
    };

    return await fetch(`${API}/${data.url}`,{
    method: "DELETE",
    credentials: "include",
    headers:finalHeaders
    });
}

export async function PATCH (data){
const authGuard = await getAuthHeaders();
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...authGuard,
      ...data.headers, // Agregar encabezados personalizados
    };

    return await fetch(`${API}/${data.url}`,{
    body: data.body ? JSON.stringify(data.body) : null,
    method: "PATCH",
    credentials: "include",
    headers:finalHeaders
    });
}




