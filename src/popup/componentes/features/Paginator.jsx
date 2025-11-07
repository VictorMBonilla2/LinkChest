import React, { useState } from "react";

export default function Paginador({ totalPages = 20, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const getPages = () => {
    const pages = [];

    const maxVisible = 4;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Ajustar si estamos cerca del final
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Añadir primer bloque y puntos suspensivos
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Páginas centrales
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Añadir último bloque y puntos suspensivos
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      {/* Botón Anterior */}
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex justify-center items-center border border-[var(--aux1-color)] rounded-lg text-sm disabled:opacity-40 hover:bg-[var(--aux2-color)] transition"
      >
        &lt;
      </button>

      {/* Números de página */}
      {getPages().map((page, index) => (
        <div
          key={index}
          onClick={() => page !== "..." && handleClick(page)}
          className={`w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer transition 
            ${
              page === currentPage
                ? "bg-[var(--aux1-color)] text-black font-bold"
                : page === "..."
                ? "opacity-60 cursor-default"
                : "border border-[var(--aux1-color)] hover:bg-[var(--aux2-color)]"
            }`}
        >
          <p>{page}</p>
        </div>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex justify-center items-center border border-[var(--aux1-color)] rounded-lg text-sm disabled:opacity-40 hover:bg-[var(--aux2-color)] transition"
      >
        &gt;
      </button>
    </div>
  );
}
