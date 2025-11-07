import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import InputMaterialUI from '../UI/Inputs/InputMaterialUI';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, registerWithEmail } from '@/services/Users';
import { UseAuth } from '@/context/AuthContext';

const schema = Yup.object().shape({
  email: Yup.string()
    .required("El correo es obligatorio")
    .email("Ingresa un correo válido."),

  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),

  repeatpassword: Yup.string().when("isRegistering", {
    is: true, // solo se aplica cuando isRegistering === true
    then: (schema) =>
      schema
        .required("Confirma tu contraseña.")
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
        .min(6, "Debe tener al menos 6 caracteres."),
    otherwise: (schema) => schema.notRequired(),
  }),

  isRegistering: Yup.boolean(), // 👈 lo incluimos en el schema para poder usarlo en `when`
});

export default function EmailLogin( {isRegistering} ) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema), // ✅ Se conecta con Yup
        mode: "onSubmit", // Valida solo al enviar
        defaultValues: {
            email: "",
            password: "",
            repeatpassword: "",
            isRegistering, // 👈 importante
        },
    });
    const navigate = useNavigate();
    const {login} = UseAuth()

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        
        if(isRegistering){
            const registerData = await registerWithEmail(data);
            if(registerData != null){
              login(registerData)
              navigate("/")
            }
            setIsSubmitting(false);
            return
        }

        const loginData = await loginWithEmail(data);
        if (loginData != null) {
            login(loginData.user)
            navigate("/")
        }
        setIsSubmitting(false);
    };


    function textoBoton() {
        return isRegistering ? 'Registrarse' : 'Ingresar';
    }


  return (
    <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto shadow-md space-y-1 flex flex-col ">
        <div className="flex flex-col gap-5 mb-3">
            <InputMaterialUI  placeholder='Ingresa tu correo' id={"emailLoginInput"} form={register("email")} error={errors.email}/>

            <div className={`grid gap-4 ${isRegistering ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <InputMaterialUI  type='password' placeholder='Contraseña' id="passwordLoginInput" form={register("password")} error={errors.password}/>

            {isRegistering && (
            <InputMaterialUI  type='password' placeholder='Confirma tu contraseña' id="repeatpasswordLoginInput" form={register("repeatpassword")} error={errors.repeatpassword}/>)}
            </div>
        </div>
        <Button
        variant="contained"
        color="primary"
        type='submit'
        disabled={isSubmitting} // Desactiva mientras carga
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{
            "&.Mui-disabled": {
            backgroundColor: "#2196f3", // azul personalizado
            color: "#fff",              // texto blanco
            opacity: 0.7,               // ligera transparencia opcional
            },
        }}
        >
        {isSubmitting ? 'Cargando...' : textoBoton()}
        </Button>

    </form>
  )
}
