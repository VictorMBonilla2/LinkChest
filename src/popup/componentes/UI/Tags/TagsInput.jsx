import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

const recentTags = ["React", "JavaScript", "Tailwind", "Frontend"];

export default function HybridTagsInput({ value = [], onChange }) {
  const [error, setError] = React.useState("");
  const MAX_TAGS = 5;


    return (
            <div className="flex flex-col gap-0.5">
            <label className="mb-2 pl-3 font-medium">Tags</label>
            <Autocomplete
                multiple
                freeSolo
                options={recentTags}
                getOptionLabel={(option) => option || ""}
                value={value}
                onChange={(e, v) => {
                if (v.length > MAX_TAGS) {
                    setError(`Máximo ${MAX_TAGS} tags permitidos`);
                    return;
                }
                setError("");
                onChange(v); // 🔹 ahora trabajamos directo con los strings
                }}
                slotProps={{
                chip: {
                    size: "small",
                    variant: "filled",
                    sx: {
                    bgcolor: "var(--primary-color)",
                    color: "#fff",
                    fontWeight: 500,
                    borderRadius: "10px",
                    "& .MuiChip-deleteIcon": {
                        color: "rgba(255,255,255,.8)",
                        "&:hover": { color: "#fff" },
                    },
                    },
                },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        error={!!error}
                        placeholder={value.length<= 0 ? "Cataloga tus enlaces con tags" : ""}
                        sx={{
                            width: "100%",
                            backgroundColor: "var(--aux2-color)",
                            borderRadius: "1.3rem",

                            "& .MuiOutlinedInput-root": {
                                borderRadius: "1.3rem",
                                display: "flex",
                                //flexWrap: "nowrap",      // ✅ en una sola línea
                                overflowX: "auto",       // ✅ scroll horizontal
                                whiteSpace: "nowrap",
              
                            },
                            "& fieldset": {
                                borderColor: "transparent", // ✅ borde por defecto
                            },
                            "&:hover fieldset": {
                                borderColor: "transparent", // ✅ borde en hover
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "var(--primary-color)", // ✅ borde cuando está enfocado
                            },

                            // Chips y elementos hijos
                            "& .MuiChip-root": {
                                flexShrink: 0,           // ✅ no se encoge el chip
                            },

                            "& .MuiOutlinedInput-input": {
                                color: "white",
                                fontSize: "1rem",
                                whiteSpace: "nowrap",
                                minWidth: "100%"
                                // flexShrink: 0,           // ✅ input no se encoge
                                // minWidth: "100%",       // 👈 ancho mínimo fijo para input
                            },

                            "& .MuiInputLabel-root": {
                                color: "white",
                                fontSize: "1rem",
                            },
                        }}
                        variant="outlined"
                    />
                )}

            />
            {/* Renderizamos el error aquí, sin afectar el alto del input */}
            {error && (
                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
                    {error}
                </p>
            )}
        </div>
    )
}
