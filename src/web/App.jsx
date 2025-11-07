import React, { lazy, Suspense, useState } from "react";
import Sidebar from "./Components/Layout/Sidebar";


const UsuariosPage = lazy(() => import("./pages/UserManager"));
const EnlacesPage = lazy(() => import("./pages/EnlaceManager"));
//const DefaultPage = lazy(() => import("./pages/DefaultPage"));


export default function App() {
  
    const [asideSelected, setAsideSelected] = useState("usuarios");


    const renderContenido = () => {
      switch (asideSelected) {
        case "usuarios":
          return <UsuariosPage />;
        case "enlaces":
          return <EnlacesPage />;
//        default:
//          return <DefaultPage />;
      }
    };
  
  

  return (
    <div className="bg_web flex min-h-screen">
      <Sidebar asideSelected={asideSelected}  setAsideSelected={setAsideSelected}/>

      <main className="flex-1 p-6">
      <Suspense fallback={<div>Cargando contenido...</div>}>
        {renderContenido()}
      </Suspense>
    </main>

    </div>
  );
}
