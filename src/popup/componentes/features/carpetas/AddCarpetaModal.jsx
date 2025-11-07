import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import InputMaterialUI from "../../UI/Inputs/InputMaterialUI";
import { crearCarpeta, editarCarpeta } from "@/services/Carpetas";

// ✅ Esquema Yup (puedes ajustar según tu BD)
const schema = yup.object({
  nombre: yup.string()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
}).required();

export default function AddCarpetaModal({ open, onClose, existingCarpetas = [], handleCreate, handleEdit, editData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues:{
      nombre: editData? editData.label : ""
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // 🚨 Validación adicional: coincidencia con BD/local
    const existe = existingCarpetas.some(
      c => c.label.toLowerCase() === data.nombre.toLowerCase() && c.id !== editData?.id);
    if (existe) {
      setError("nombre", {
        type: "manual", 
        message: "Ya existe una carpeta con ese nombre",
      });
      setIsSubmitting(false);
      return;
    }
    if(editData){
      const isEdited =  await editarCarpeta(data.nombre, editData.id)
  
      if(isEdited.ok){
      
        handleEdit(isEdited.editedCarpeta)
        reset();
        handleClose();
      }
    }
    const isCreated = await crearCarpeta(data.nombre)
  
    if(isCreated.ok){    
      handleCreate(isCreated.newCarpeta)
      reset();
      handleClose();
    }


    setIsSubmitting(false);
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  useEffect(() => {
  reset({
    nombre: editData ? editData.label : ""
  });

}, [editData, reset]);


  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-color)] rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl text-white font-bold mb-4">{editData? "Editar Carpeta"  : "Añadir Carpeta"}</h2>

        <form className="space-y-4">
          <div>
            <InputMaterialUI label={"Nombre de la carpeta"} form={register("nombre")}/>
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[var(--aux2-color)] hover:bg-gray-400"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className={`px-4 py-2 rounded text-white ${
                isSubmitting ? "bg-[var(--primary-color)]" : "bg-[var(--primary-color)]"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // 👈 el portal inserta el modal en el body
  );
}
