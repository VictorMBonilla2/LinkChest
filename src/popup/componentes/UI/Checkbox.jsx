import { Tooltip } from "@mui/material";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Checkbox({ label, checked, onChange, tooltip = "" }) {
  return (
    <Tooltip
      title={tooltip || ""}       // 👈 texto del tooltip
      placement="bottom"             // posición
      disableHoverListener={!tooltip} // solo si hay texto
    >
      <label
        onClick={onChange}
        className="flex items-center cursor-pointer select-none gap-2"
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
            checked ? "bg-blue-600 border-blue-600" : "border-gray-400"
          }`}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>

        {/* 👇 Texto con tooltip MUI */}
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
          }}
          className="text-sm text-white"
        >
          {label}
        </span>
      </label>
    </Tooltip>
  );
}
