import React, { memo } from "react";

import { Trash, Pen } from "lucide-react";

import { Menu, MenuItem } from "@mui/material";

function MenuEnlace({ anchorEl, handleClose, handleClick }) {
 
  const open = Boolean(anchorEl);
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      // estilos personalizados
      PaperProps={{
        className:
          "w-56 bg-[var(--aux2-color)] border border-gray-600 rounded-lg shadow-lg text-white overflow-hidden",
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors"
        onClick={() => {
          handleClick("edit");
          handleClose();
        }}
      >
        <Pen size={18} />
        Editar
      </MenuItem>
      <MenuItem
        className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 cursor-pointer transition-colors"
        onClick={() => {
          handleClick("delete");
          handleClose();
        }}
      >
        <Trash size={18} />
        Borrar
      </MenuItem>
    </Menu>
  );
}

export default memo(MenuEnlace);










































/*
export default function MenuEnlace({ isOpen, anchor = "top-[50%] right-0", onClose, onAction }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute ${anchor} z-50`}
        >
          <ul
            role="menu"
            className="w-56 bg-[var(--aux2-color)] border border-gray-600 rounded-lg shadow-lg text-white overflow-hidden"
          >
            <li
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors"
              onClick={() => {
                onAction?.("edit");
                onClose?.();
              }}
            >
              <Pen size={18} />
              Editar
            </li>
            <li
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 cursor-pointer transition-colors"
              onClick={() => {
                onAction?.("delete");
                onClose?.();
              }}
            >
              <Trash size={18} />
              Borrar
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}*/