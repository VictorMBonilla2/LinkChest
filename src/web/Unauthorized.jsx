import React from 'react'

import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="bg-[#0f1117] flex items-center justify-center min-h-screen text-gray-200 px-6">
      <div className="text-center max-w-md">
        {/* Ícono principal */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/10 rounded-full">
            <ShieldAlert className="w-16 h-16 text-red-400" />
          </div>
        </div>

        {/* Código y mensaje */}
        <h1 className="text-6xl font-bold text-red-400 mb-2">401</h1>
        <h2 className="text-2xl font-semibold mb-4">Acceso no autorizado</h2>
        <p className="text-gray-400 mb-8">
          No tienes permisos para acceder a esta sección.  
          Si crees que esto es un error, contacta con el administrador o inicia sesión con una cuenta autorizada.
        </p>

        {/* Botón de volver 
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        */}
      </div>
    </div>
  );
}
