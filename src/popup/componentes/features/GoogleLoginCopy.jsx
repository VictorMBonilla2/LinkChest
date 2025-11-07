import { UseAuth } from "@/context/AuthContext";
import { loginWithGoogle } from "@/services/Users";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { login } = UseAuth();

  const handleGoogleLogin = () => {
    const clientId = "477943011083-lpg0i2b1gfojr3jns4g4g9b50taa0t01.apps.googleusercontent.com"; 
    const redirectUri = chrome.identity.getRedirectURL(); // genera: https://<EXT_ID>.chromiumapp.org/
    const scopes = ["openid", "email", "profile"];

    const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("response_type", "token");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes.join(" "));

    // lanzar ventana de login
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl.toString(),
        interactive: true,
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Error en login:", chrome.runtime.lastError);
          return;
        }

        // Extraer token del redirectUrl
        const params = new URLSearchParams(new URL(redirectUrl).hash.substring(1));
        const accessToken = params.get("access_token");



        if (accessToken) {
          try {
            // mandar token al backend
            const loginData = await loginWithGoogle(accessToken);

            if (loginData) {
              login(); // tu método para guardar sesión
              navigate("/");
            }
          } catch (err) {
            console.error("Error validando token en backend:", err);
          }
        }
      }
    );
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleGoogleLogin}
        className="bg-white border rounded-lg px-4 py-2 shadow hover:bg-gray-100 flex items-center gap-2"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
        Iniciar sesión con Google
      </button>
    </div>
  );
}