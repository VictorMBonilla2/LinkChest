import { useEffect } from "react";
import { ChevronDown } from "lucide-react"; // icono opcional

/**
 * 
 * @param {id, isOpen, onToggle}  
 * Son necesarios para controlar la apertura de varios select en caso de que haya mas de uno en una vista
 * @returns 
 */
export default function CustomSelect({
  id,
  label,
  options = [],
  value,              // 🔹 valor controlado desde afuera
  defaultValue,       // 🔹 valor inicial si no hay `value`
  onChange,
  onClickNew,
  isOpen,
  onToggle,
  size = "md", // sm | md | lg (no implementado)
  className = "",
}) {
  // 🔹 Resolver la opción seleccionada
  const selected =
    options.find((opt) => opt.value === value) ||
    options.find((opt) => opt.value === defaultValue) ||
    null;


  useEffect(() => {
  const initial = value || defaultValue;
  if (initial && onChange && selected?.value !== initial) {
    onChange(initial);
  }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, defaultValue]);


  const handleSelect = (option) => {
    if (option.value === "__addNew__") {
      // 🚀 Acción personalizada
      onClickNew && onClickNew();
      onToggle(null);
      return;
    }

    // Selección normal
    onChange && onChange(option.value); // 🔹 Notificamos al padre
    onToggle(null);
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={`w-full relative  ${className}`}>
      {label && <label className={`block mb-2 pl-3 font-medium ${sizeClasses[size]}`} >{label}</label>}

      {/* Select Box */}
      <div
        onClick={() => onToggle(isOpen ? null : id)}
        className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer min-h-[42px]
          ${isOpen ? "border-blue-500" : "border-gray-400"}
          bg-[var(--aux2-color)] text-white`}
      >
        <span className="text-sm">
          {selected ? selected.label : "Selecciona una opción"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-1 w-full border rounded-lg shadow-lg bg-[var(--aux2-color)] z-10">
          <ul className="max-h-40 border rounded-lg  overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="p-2 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}