import { UseAuth } from "@/context/AuthContext";
import { loginWithGoogle } from "@/services/Users";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function GoogleLogin() {
  const navigate = useNavigate();
  const {login} = UseAuth();



  useEffect(() => {
    /* Cargar el script de Google */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    /* Inicializar cuando cargue */
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: `${import.meta.env.VITE_CLIENT_ID}`,
        callback: HandleCredentialResponse,
        auto_select: false,
      });

      // Renderizar el botón
      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "large" }
      );

      // Opcional: activar One Tap
      // window.google.accounts.id.prompt();
    };

    //Validar TOken en BD
    const HandleCredentialResponse = async (response) => {

      const loginData = await loginWithGoogle(response.credential);
      
      if (loginData != null) {
        login()
        navigate("/")
      }

    };


  }, [navigate]);




  return (

    <div id="googleButton"></div>

  );
}
