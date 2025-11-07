import { useEffect, useRef, useState } from "react";
import CustomSelect from "../Select";

/** Helpers */
const to12h = (hhmm = "00:00") => {
const [hh, mm] = hhmm.split(":").map(Number);
const period = hh >= 12 ? "PM" : "AM";
let h12 = hh % 12;
if (h12 === 0) h12 = 12;
return {
    text: `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")}`,
    period,
};
};

// ✅ Convierte de 24h → 12h + periodo
const from24h = (hhmm24) => {
const [hStr, mStr] = hhmm24.split(":");
let h = parseInt(hStr, 10);
const m = parseInt(mStr, 10);
const period = h >= 12 ? "PM" : "AM";
if (h === 0) h = 12;
else if (h > 12) h -= 12;
return { hhmm12: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`, period };
};

// ✅ Convierte de 12h → 24h
const to24h = (hhmm12, period) => {
const [hStr, mStr] = hhmm12.split(":");
let h = parseInt(hStr, 10);
const m = parseInt(mStr, 10);
if (period === "AM" && h === 12) h = 0;
else if (period === "PM" && h < 12) h += 12;
return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
/**
 * Props:
 *  - value: string "HH:mm" (24h) — controlado por el padre
 *  - onChange: (newValue24h) => void
 */
export default function TimePicker({ value, onChange }) {
  const [inputTime, setInputTime] = useState("00:00"); // valor para <input type="time"> (24h)
  const [period, setPeriod] = useState("AM"); // "AM" | "PM" (para mostrar/select)
  const isEditing = useRef(false); // true mientras el usuario tenga foco en el input o select
  const lastProp = useRef(""); // guarda el último value que vino del padre para evitar efecto innecesario
  const [activeSelect, setActiveSelect] = useState(false);
  // Inicializa / sincroniza cuando el padre cambia el value y no estamos editando
  useEffect(() => {
    if (!value) return;
    // Si value no cambió externamente, no hacemos nada
    if (value === lastProp.current) return;
    if (isEditing.current) {
      // Si estamos editando, no forzamos la re-sincronización
      return;
    }

    // Convertir value (24h) a estado interno
    setInputTime(value);
    const { period: p } = to12h(value);
    setPeriod(p);
    lastProp.current = value;
  }, [value]);

  // cuando el usuario cambia el input (hh:mm en 24h o 12h?, el input entrega 24h)
  const handleInputChange = (e) => {
    const newTime = e.target.value; // este viene en "HH:mm" (24h) según spec del input
    // Normalizar: si el navegador devuelve "", ignorar temporalmente
    if (!newTime) {
      setInputTime("");
      return;
    }
    // Actualizamos el input controlado local
    setInputTime(newTime);

    // Actualizamos el periodo local (por si el usuario cambió la hora y el periodo debería ajustarse)
    const { period: p } = to12h(newTime);
    setPeriod(p);

    // Notificamos al padre con formato 24h (aseguramos que sea válido)
    lastProp.current = newTime;
    onChange && onChange(newTime);
  };

  // Cuando el usuario cambia AM/PM desde el select personalizado
    const handlePeriodChange = (newPeriod) => {
    // Si no hay input, asumimos "12:00 PM"
    const base = inputTime || "12:00";

    // Convertimos el input actual (24h) a 12h
    const { hhmm12 } = from24h(base);

    // Luego aplicamos el nuevo periodo
    const new24 = to24h(hhmm12, newPeriod);

    setPeriod(newPeriod);
    setInputTime(new24); // el input mantiene formato 24h
    lastProp.current = new24;
    onChange && onChange(new24);
    };


  // Focus y blur para bloquear re-sincronizaciones
  const handleFocus = () => {
    isEditing.current = true;
  };
  const handleBlur = () => {
    // Pequeño delay para permitir clicks en el AM/PM select si es que usan clicks rápidos
    setTimeout(() => {
      isEditing.current = false;
      // Cuando el usuario termina de editar, nos aseguramos de sincronizar lastProp
      if (inputTime && inputTime !== lastProp.current) {
        lastProp.current = inputTime;
        onChange && onChange(inputTime);
      }
    }, 100);
  };

  // Mostrar 12h legible al usuario: podemos usar to12h si queremos render adicional
  const display12 = to12h(inputTime || "00:00");

  return (
    <div className="flex flex-col gap-1">

        <div className="text-sm text-gray-300 ml-2 flex  gap-2">
            <label className="text-sm pl-3 font-medium text-white">Hora exacta: </label>
            {display12.text} {display12.period}
        </div>

        <div className="flex items-center gap-2">

            <input
            type="time"
            value={inputTime}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="border rounded-lg p-2 flex-2 text-white bg-[var(--aux2-color)] focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <CustomSelect
                id="tyme"
                options={[{value:"AM", label:"AM"}, {value:"PM", label:"PM"}]}
                value={period}              
                onChange={e => handlePeriodChange(e)}                 
                isOpen={activeSelect}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onToggle={setActiveSelect}
                className="flex-1"
            />
      </div>
    </div>
  );
}
