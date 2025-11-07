import { TextField } from '@mui/material'
import React, { memo } from 'react'

function InputMaterialUI({ id,value, isDisabled, onChange, error, label, form, type ="text",placeholder = ""}) {

  return (
    <div className=" flex flex-col gap-1.5">
      {label && (
        <label className="block pl-3 font-regular">{label}</label>
      )}
      <TextField
        id= {id ? id :"filled-basic"}
        variant="outlined"
        type={type}
        {...form} // RHF (maneja name, ref, onBlur, onChange)
        value={value ?? form?.value} //  prioriza value aislado si se pasa
        onChange={(e) => {
          form?.onChange?.(e); // primero avisa a RHF
          onChange?.(e);       // luego ejecuta el onChange aislado
        }}
        disabled={isDisabled}
        placeholder={placeholder}
        error={!!error}
        helperText={error?.message}
        sx={{
          width: "100%",
          borderRadius: "0.625rem",

          // Estilo para la caja completa
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.625rem",
            height: "45px", // fuerza la altura del input box
            padding: 0,     // elimina espacio extra
            backgroundColor: "var(--aux2-color)",
          },

          // Estilo para el <input>
          "& .MuiInputBase-input": {
            color: "white",
            fontSize: "1rem",
            padding: "0 14px", // vertical 0 → controla la altura real
            height: "100%",    // ocupa todo el alto del root
            boxSizing: "border-box",
            
          },

          // Estilo para el label
          "& .MuiInputLabel-root": {
            color: "white",
            fontSize: "0.9rem",
          },
        }}
      />
    </div>
  );
}

  export default memo(InputMaterialUI);

                      
