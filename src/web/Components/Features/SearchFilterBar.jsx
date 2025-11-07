import React, { useState, useEffect, memo } from "react";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { Button } from "@mui/material";


/**
 * Barra de búsqueda y filtros reutilizable
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Valor actual del campo de búsqueda.
 * 
 * @param {string} props.filterStatus - Valor actual del filtro de estado.
 * @param {(value: string) => void} props.onFilterStatusChange - Callback para actualizar el filtro de estado.
 * @param {string} props.filterNotification - Valor actual del filtro de notificación.
 * @param {(value: string) => void} props.onFilterNotificationChange - Callback para actualizar el filtro de notificación.
 */
 function SearchFilterBar({
  metodo: onSearchChange
}) {
  const [internalSearch, setInternalSearch] = useState("");

  // 🧠 debounce de 400ms
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange(internalSearch);
    }, 400);
    return () => clearTimeout(delay);
  }, [internalSearch, onSearchChange]);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* 🔍 Campo de búsqueda */}
      <div className="flex-1 relative min-w-[200px]">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar enlaces..."
          value={internalSearch}
          onChange={(e) => setInternalSearch(e.target.value)}
          className="w-full bg-[#6b7280]/30 text-white placeholder-gray-400 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🟩 Filtro de Estado 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#6b7280]/30 hover:bg-[#6b7280]/40 text-white border-0 px-6">
            <Filter className="w-4 h-4 mr-2" />
            Estado: {filterStatus}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#252837] border-gray-700">
          {["Todos", "Activo", "Inactivo"].map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onFilterStatusChange(option)}
              className="text-white hover:bg-gray-700"
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

       🟦 Filtro de Notificación 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#6b7280]/30 hover:bg-[#6b7280]/40 text-white border-0 px-6">
            <Filter className="w-4 h-4 mr-2" />
            Notificación: {filterNotification}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#252837] border-gray-700">
          {["Todos", "Inteligente", "Programada", "Manual", "Ninguna"].map(
            (option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onFilterNotificationChange(option)}
                className="text-white hover:bg-gray-700"
              >
                {option}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      */}
    </div>
  );
}

export default memo(SearchFilterBar)
