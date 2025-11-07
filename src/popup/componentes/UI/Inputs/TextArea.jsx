import * as React from "react";
import TextField from "@mui/material/TextField";

export default function TextArea({ form,label=""}) {
  return (
    <div className="flex flex-col gap-2">
    {label && (
        <label className="block pl-3 font-regular">{label}</label>
      )}

    <TextField
      placeholder="Escribe algo..."
      multiline
      {...form}
      minRows={3}
      maxRows={4}
      variant="outlined"
      fullWidth
      sx={{
        // ----- Base -----
        "& .MuiOutlinedInput-root": {
          backgroundColor: "var(--aux2-color)",
          borderRadius: "12px",
          color: "white",
          fontSize: "14px",
          alignItems: "flex-start", // alinea texto arriba
          paddingY: "5px",
          transition: "border-color 0.2s ease",

          // ----- Hover -----
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },

          // ----- Focus -----
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-color)",
            borderWidth: "1.5px",
          },

          // ----- Label -----
          "& .MuiInputLabel-root": {
            color: "white",
          },
        },

        // ----- Outline -----
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.2)",
        },

        // ----- Label (fuera del root) -----
        "& .MuiInputLabel-root": {
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.9rem",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--primary-color)",
        },
      }}
      
    />
    </div>
  );
}
