import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Header from "./componentes/layout/Header";
import Enlace from "./componentes/Enlace";
import { obtenerEnlacesConRecordatoriosLocal } from "@/services/Enlaces";
import EnlaceRecordatorio from "./componentes/EnlaceRecordatorio";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { LogOut, MoreVerticalIcon } from "lucide-react";
import { logout } from "@/services/Users";


export default function Home() {

  const [Enlaces, setEnlaces] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navigator = useNavigate()
  const handleLogout = async () => {
    try {
      const keysToRemove = ["jwt", "jwtAuth", "token", "userActive"]; // agrega más keys si es necesario

      // 1️⃣ Chrome Storage
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        keysToRemove.forEach(key => {
          chrome.storage.local.remove(key, () => {
            if (chrome.runtime.lastError) {
              console.warn(`No se pudo eliminar ${key} en chrome.storage:`, chrome.runtime.lastError);
            } else {
              console.log(`${key} eliminado de chrome.storage`);
            }
          });
        });
      }

      // 3️⃣ LocalStorage (si window y localStorage existen)
      if (typeof window !== "undefined" && window.localStorage) {
        keysToRemove.forEach(key => {
          if (window.localStorage.getItem(key)) {
            window.localStorage.removeItem(key);
            console.log(`${key} eliminado de localStorage`);
          }
        });
      }

      await logout()

      navigator("/login")

      console.log("Logout completado ✅");

      // Opcional: redirigir a login
      // if (typeof window !== "undefined") window.location.href = "/login";

    } catch (err) {
      console.error("Error al hacer logout:", err);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const enlacesConRecordatorios = await obtenerEnlacesConRecordatoriosLocal();
      console.log("Enlaces con recordatorios:", enlacesConRecordatorios);
      setEnlaces(enlacesConRecordatorios);
    };

    fetchData();
  }, []);


  return (
    <div className="bg_popup ">
      <Header title={"Home"}>
        <Link to={"/addpage"}>
          <svg xmlns="http://www.w3.org/2000/svg" className='transition duration-200 fill-white  hover:scale-[1.2]'
            width="45" height="45" viewBox="0 0 24 24"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4" /></svg>
        </Link>
        <Link to={"/search"}>
          <svg xmlns="http://www.w3.org/2000/svg" className='transition duration-200 fill-white hover:scale-[1.2]'
            width="45" height="45" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6" /></svg>
        </Link>

        <IconButton size="small" style={{ marginLeft: "auto" }}
          onClick={(e) => { e.stopPropagation(); handleMenuOpen(e) }}>
          <MoreVerticalIcon fontSize="small" color="white" />
        </IconButton>

      </Header>


      <main className="mt-auto flex-1 relative">
        <p className="text-2xl font-bold text-center my-7">Proximos Recordatorios</p>

        <div className=" mt-auto flex flex-col gap-3 overflow-y-auto max-h-100 ">
          {!Array.isArray(Enlaces) || Enlaces.length === 0 ? (
            <p className="text-xl font-light text-center my-7">
              Actualmente no tienes Enlaces para recordar
            </p>
          ) : (
            Enlaces.map(page => (
              <EnlaceRecordatorio key={page._id} page={page} />
            ))
          )}
        </div>

        <Menu  open={open} onClose={handleMenuClose}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "var(--aux2-color)", color: "white",
                width: 170, border: "1px solid #374151", borderRadius: 2.5,
              },
            },
            list: { sx: { p: 0 } }} }

            transformOrigin={{
              vertical: "top",      // punto de aparición del menú
              horizontal: "center",  // abre hacia la izquierda
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 68, left:505 }}
           // anchorEl={anchorEl}
          
          >
          <MenuItem onClick={(e) => {
            e.stopPropagation(); handleLogout();
            handleMenuClose();
          }}
            
            sx={{
              display: "flex", gap: 1.5, px: 2, py: 1,
              textAlign: "center", alignContent:"center",
              "&:hover": { backgroundColor: "#2563eb" }
            }}>
            <LogOut size={18} /> Logout
          </MenuItem>
        </Menu>

        <div className="pointer-events-none absolute  -bottom-5 left-0 w-130 h-[40px] bg-gradient-to-b from-transparent to-[var(--bg-color)]" />
      </main>

    </div>
  );
}
