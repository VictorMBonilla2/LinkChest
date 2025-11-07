import React, { useEffect } from 'react'
import SvgButton from './componentes/UI/SvgButton'
import Header from './componentes/layout/Header'
import { Button, TextareaAutosize } from '@mui/material'
import { useForm ,  Controller} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import Input from './componentes/UI/Input';
import CustomSelect from './componentes/UI/Select';
import TagsInput from './componentes/UI/Tags/TagsInput';
import InputMaterialUI from './componentes/UI/Inputs/InputMaterialUI';
import CarpetasSelect from './componentes/features/carpetas/CarpetasSelect';
import { crearEnlace, editarEnlace, obtenerEnlacesByID } from '@/services/Enlaces';
import { useParams } from 'react-router-dom';
import { Plus, PlusCircleIcon, RefreshCcw } from 'lucide-react';
import TextArea from './componentes/UI/Inputs/TextArea';
import DaysListChecks from './componentes/features/DaysListChecks';
import TimePicker from './componentes/UI/Inputs/TimePicker';
import Checkbox from './componentes/UI/Checkbox';
import FrecuencyAlertsChecks from './componentes/features/FrecuencyAlertsChecks';


const schema = Yup.object().shape({
    nombre: Yup.string()
        .required("El nombre es obligatorio")
        .min(2, "Debe tener al menos 2 caracteres")
        .max(60,"El nombre no debe superar los 40 caracteres")
        .matches(/^(?!\s*$)[\p{L}\p{N}\p{P}\p{S}\s]+$/u, "Solo se permiten letras"),
    url: Yup.string()
        .required("El apellido es obligatorio")
        .min(2, "Debe tener al menos 2 caracteres"),
    descripcion: Yup.string()
        .max(60, "La descripción no debe superar los 60 caracteres."),

    tipoRecordatorio: Yup.string().required("Selecciona un tipo de recordatorio"),

    horaRecordatorio: Yup
        .string()
        .when("tipoRecordatorio", {
        is: "preciso",
        then: (schema) => schema.required("Debes seleccionar una hora exacta"),
        otherwise: (schema) => schema.notRequired(),
        }),

    frecuencia: Yup
        .string()
        .when("tipoRecordatorio", {
        is: "inteligente",
        then: (schema) => schema.required("Selecciona la frecuencia de recordatorios"),
        otherwise: (schema) => schema.notRequired(),
        }),

    diasSeleccionados: Yup
        .array()
        .when("tipoRecordatorio", {
        is: "preciso",
        then: (schema) =>
            schema.min(1, "Debes seleccionar al menos un día para recordatorios precisos"),
        otherwise: (schema) => schema.notRequired(),
        }),
});

export default function AddPage() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSelect, setActiveSelect] = React.useState(null);
    const [carpetaID, setCarpetaID] = useState("");
    const [tags, setTagList] = useState([]);
    const { id } = useParams(); 
    const {control, watch,resetField , register,setValue, handleSubmit, formState: { errors },  reset} = useForm({
        resolver: yupResolver(schema), // ✅ Se conecta con Yup
        defaultValues: {
        tipoRecordatorio: "ninguno",
        horaRecordatorio: "",
        frecuencia: "",
        diasSeleccionados: [],
        url: ""
        },
        mode: "onSubmit", // Valida solo al enviar
    }); 
    useEffect(() => {
    if (!id) return; // Si no hay id, es creación

    const fetch = async () => {
        try {
            const dataEnlace = await obtenerEnlacesByID(id); // tu fetch
            // Setea inputs del formulario
            let tagList= [];
            reset({
                nombre: dataEnlace.titulo,
                url: dataEnlace.url,
                tipoRecordatorio: dataEnlace.tipoRecordatorio||"ninguno",
                horaRecordatorio: dataEnlace.horaRecordatorio || "",
                frecuencia: dataEnlace.frecuencia || "",
                diasSeleccionados: dataEnlace.diasSeleccionados || [],
                // cualquier otro input que tengas en el schema
            });
            // Setea tus estados locales también si los manejas fuera del formulario
            setCarpetaID(dataEnlace.carpetaId || "");
            //setTimer(dataEnlace.timer || "");
            if(dataEnlace.tags){
                tagList=  dataEnlace.tags.map(item => item.name)
            }
            
            setTagList(tagList);
            
        } catch (err) {
            console.error("Error al obtener el enlace:", err);
        }
    };

    fetch();
}, [id, reset]);

    const selectedType = watch("tipoRecordatorio");

    useEffect(() => {
    if (selectedType === "preciso") {
        resetField("frecuencia");
    } else if (selectedType === "inteligente") {
        resetField("horaExacta");
        resetField("diasSeleccionados");
    }
    }, [selectedType, resetField]);

    useEffect(() => {
    const setPageInfo = async () => {
        if (import.meta.env.DEV) {
        // 🧩 Modo desarrollo: usar datos del documento actual
        setValue("url", window.location.href);
        const cleanTitle = (document.title || "").replace(/^\(\+?\d+\)\s*/g, "").trim();
        setValue("nombre", cleanTitle);
        } else {
        // 🧩 Modo extensión: usar API de Chrome
        if (chrome?.tabs?.query) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs?.[0];
            const currentUrl = currentTab?.url || "";
            const cleanTitle = (currentTab?.title || "").replace(/^\(\+?\d+\)\s*/g, "").trim();
            setValue("nombre", cleanTitle);
            setValue("url", currentUrl);
            });
        } else {
            console.warn("chrome.tabs no está disponible en este entorno.");
        }
        }
    };

    setPageInfo();
    }, [setValue]);



    const typesRemembers = Object.freeze({
        ninguno:    { label: 'Ninguno' },
        preciso:    { label: 'Preciso' },
        inteligente: { label: 'Inteligente' },});
    const typeOptions = Object.entries(typesRemembers).map(([key, item]) => ({
        value: key,
        label: item.label,
    }));

    const onSubmit = async (data) => {
        setIsSubmitting(true);  
        let dataNEw = {...data, carpetaID, tags}
 
        if(id){
            dataNEw = {...dataNEw, id} 
            await editarEnlace(dataNEw)
        }else{
            await crearEnlace(dataNEw)
        }
        
        setIsSubmitting(false);
    };



    return (
        <div className='bg_popup overflow-y-auto scroll-smooth'>
            <Header
                left={<SvgButton link={"../"} children={<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24"><path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z" /></svg>} />}
                title={id? "Editar Pagina"  : "Añadir Pagina" }
            >
            </Header>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto shadow-md space-y-1 flex flex-col "
            >
                <div className="AddBotton_container flex justify-center" >
                    <Button
                        variant="contained"
                        type='submit'
                        className={`${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}
                        sx={{
                            backgroundColor: "var(--aux4-color)",
                            borderRadius: "calc(infinity * 1px)",
                            minWidth: "30px",
                            width: "122px",
                            height: "122px",
                            padding: "10px 20px",
                            color: "var(--primary-color)",
                            fontSize: "3.5rem",
                            fontWeight: "bold",
                            textTransform: "none", // evita que el texto se ponga en MAYÚSCULAS
                            "&:hover": {
                                backgroundColor: "var(--aux3-color)",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        {/*<svg xmlns="http://www.w3.org/2000/svg" width="1.01em" height="1em" viewBox="0 0 717 715"><path fill="currentColor" d="M438 279h279v159H438v277H279V438H0V279h279V0h159z" /></svg>*/}
                        {id? <RefreshCcw style={{width:"1.01em", height:"1em"}}/>  : <Plus style={{width:"1.01em", height:"1em"}}/> } 
                    </Button>

                </div>

                <div className="flex flex-col gap-4">
                    {/* Nombre */}
                    <InputMaterialUI label={"Nombre"} placeholder='Nombre de pagina' form={register("nombre")} error={errors.nombre} />

                    {/* Apellido */}
                    <InputMaterialUI label={"URl"} isDisabled={!!id} placeholder='https://www.youtube.com' form={register("url")} error={errors.url} />
                    {/* Correo */}

                    <TextArea label={"Descripción"} form={register("descripcion")} />

                    <div className="flex justify-center items-center gap-2">

                        <CarpetasSelect id="carpetas" isOpen={activeSelect === "carpetas"}
                            onToggle={setActiveSelect} 
                            value={carpetaID}
                            onChange={(val) => setCarpetaID(val)}
                        />

                        <Controller
                            name="tipoRecordatorio"
                            control={control}
                            defaultValue="ninguno"
                            render={({ field }) => (
                                <CustomSelect
                                    id="tipoRecordatorio"
                                    label="Modo de recordatorio"
                                    options={typeOptions}
                                    value={field.value}          // <- Valor desde RHF
                                    onChange={field.onChange}    // <- Notifica a RHF
                                    onBlur={field.onBlur}        // <- Marca como tocado
                                    isOpen={activeSelect === "tipoRecordatorio"}
                                    onToggle={setActiveSelect}
                                    defaultValue="ninguno"
                                />
                            )}
                        />
                        {errors.tipoRecordatorio && (
                            <p className="text-red-500 text-sm">{errors.tipoRecordatorio.message}</p>
                        )}


                    </div>
                    
                    {/* 🔸 Caso 1: Recordatorio preciso */}
                    {selectedType === "preciso" && (
                        <>
                        <p className="pl-3 text-sm font-medium">Selecciona los días a recordar:</p>

                        {/* Días seleccionados */}
                        <Controller
                            name="diasSeleccionados"
                            control={control}   
                            render={({ field }) => (
                            <DaysListChecks
                                selectedDays={field.value}
                                setSelectedDays={(updater) => {
                                // Si el componente pasa una función, la ejecutamos con el valor actual
                                const newValue =
                                typeof updater === "function" ? updater(field.value) : updater;

                                // Y se lo pasamos al form
                                field.onChange(newValue);
                                }}
                            />
                            )}
                        />
                        {errors.diasSeleccionados && (
                            <p className="text-red-500 text-sm">{errors.diasSeleccionados.message}</p>
                        )}

                        {/* Hora exacta */}
                        <Controller
                            name="horaRecordatorio"
                            control={control}
                            render={({ field }) => (
                            <TimePicker value={field.value} onChange={field.onChange} />
                            )}
                        />
                        {errors.horaRecordatorio && (
                            <p className="text-red-500 text-sm">{errors.horaRecordatorio.message}</p>
                        )}

                        <Checkbox
                            label="Recordar solo en días seleccionados"
                            checked={false}
                            onChange={() => {}}
                        />
                        </>
                    )}

                    {/* 🔸 Caso 2: Recordatorio inteligente */}
                    {selectedType === "inteligente" && (
                        <>
                        <p className="pl-3 text-sm font-medium">Selecciona la intensidad de las alertas:</p>
                        <Controller
                            name="frecuencia"
                            control={control}
                            render={({ field }) => (
                            <FrecuencyAlertsChecks selected={field.value} setSelected={(updater)=>{
                                
                                const newValue =typeof updater === "function" ? updater(field.value) : updater;
                                field.onChange(newValue);
                                }}/>
                            )}
                        />
                        {errors.frecuencia && (
                            <p className="text-red-500 text-sm">{errors.frecuencia.message}</p>
                        )}
                        </>
                    )}




                    <TagsInput value={tags} onChange={setTagList} />
                </div>

            </form>
        </div>
    )
}
