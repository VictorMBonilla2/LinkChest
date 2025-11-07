import React, { useEffect, useState } from 'react'
import Tabla from '../Tablas/Tabla'

import { ArrowDown, ArrowUp, BarChart2, Copy, Edit, Ellipsis, EllipsisVertical, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { CapitalizateText } from '@/web/utils';
import { sudoActivarUsuario, sudoDesactivarUsuario, sudoEliminarUsuario } from '@/services/Users';


export default function UserTable({ data }) {
  
  const [bodyList, setBodyList] = useState([]);

  useEffect(() => {    
    function mapData() {
      return data.map((item) => ({
        id: item._id,
        estado: item.estado,
        dataRow: [
          { text: item.nombre },
          { text: item.email },
          { text: new Date(item.fechaRegistro).toLocaleDateString("es-CO") },
          { text: item.enlacesCreados.toString() },
          { text: CapitalizateText(item.estado), isRounded: true },
        ]
      }));
    }
    setBodyList(mapData())
  }, [data])

  const headers= ["Usuario", "Correo", "Fecha de creación", "Enlaces creados", "Estado"]
  
    const handleDeleteItem = async (itemId)=>{
      if(!itemId)return
  
      const isEliminated = await sudoEliminarUsuario(itemId)
  
      if(isEliminated){
        eliminarFila(itemId)
      }
  
    }
  
    const handleDisableItem= async (itemId) =>{
      console.log("entrando");
      
      if(!itemId)return
      
      const isDisabled = await sudoDesactivarUsuario(itemId)
  
      if(isDisabled){
        changeEstado(itemId)
      }
    }
    const handleEnableItem= async (itemId) =>{
      if(!itemId)return
      
      const isEnabled = await sudoActivarUsuario(itemId)
  
      if(isEnabled){
        changeEstado(itemId)
      }
    }
  
    function changeEstado(rowId) {
      setBodyList(prevList =>
        prevList.map(item => {
          if (item.id === rowId) {
            const nuevoEstado = item.estado === "activo" ? "Inactivo" : "Activo";
  
            // Clonamos y actualizamos dataRow
            const newDataRow = [...item.dataRow];
            console.log(newDataRow);
            
            newDataRow[4] = { ...newDataRow[4], text: nuevoEstado };
  
            return {
              ...item,
              estado: nuevoEstado, // bandera interna
              dataRow: newDataRow, // refleja en tabla
            };
          }
          return item;
        })
      );
    }
  
    
  function eliminarFila(rowId) {
    setBodyList((prevList) => prevList.filter((item) => item.id !== rowId));
  }

  function renderActions(row) {
    const estado = row.estado?.toLowerCase();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-2 hover:bg-[#2c2f3a] rounded-xl text-gray-300 transition-colors duration-200"
            title="Acciones"
          >
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="bg-[#1e2130] border border-[#333645] rounded-xl shadow-lg p-1.5 w-44"
        >
          <DropdownMenuItem
            onClick={() => console.log("Ver estadísticas", row)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-200 hover:bg-[#2f3244] cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <span>Ver estadísticas</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => console.log("Editar", row)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-200 hover:bg-[#2f3244] cursor-pointer"
          >
            <Edit className="w-4 h-4 text-green-400" />
            <span>Editar</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row[1]?.text || "")}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-200 hover:bg-[#2f3244] cursor-pointer"
          >
            <Copy className="w-4 h-4 text-blue-400" />
            <span>Copiar enlace</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 h-px bg-[#333645]" />
          { estado === 'activo' ?
          <DropdownMenuItem
            onClick={() => handleDisableItem(row.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-[#3a1f1f] cursor-pointer">
            <ArrowDown className="w-4 h-4"/>
            <span>Desactivar</span>
          </DropdownMenuItem>
            :
          <DropdownMenuItem
            onClick={() => handleEnableItem(row.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-green-400 hover:bg-[#3a1f1f] cursor-pointer">
            <ArrowUp  className="w-4 h-4"/>
            <span>Activar</span>
          </DropdownMenuItem>
          }

          <DropdownMenuItem
            onClick={() => handleDeleteItem(row.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-[#3a1f1f] cursor-pointer"
          >
            <Trash className="w-4 h-4" />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  
  return (
      <Tabla headers={headers} body={bodyList} 
      
          renderActions={renderActions}
      />
  )
}


