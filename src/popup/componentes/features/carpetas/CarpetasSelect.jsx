import React, { useEffect, useState } from 'react'
import CustomSelect from '../../UI/Select'
import { obtenerCarpetasByUser } from '@/services/Carpetas';
import AddCarpetaModal from './AddCarpetaModal';

export default function CarpetasSelect({ id, value,isOpen, onToggle, onChange }) {

    const [listCarpetas, setListaCarpetas] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchCarpetas() {
            const response = await obtenerCarpetasByUser();            
            setListaCarpetas(response)
        }
        fetchCarpetas()
    }, []);

    const handleClickNew = () => {
        setOpen(true)

    }

    const handleCreateFolder = (newCarpeta) => {   
        const nuevaCarpeta = {
            value: newCarpeta._id,
            label: newCarpeta.nombre,
        }
        setListaCarpetas((prev) => [...prev, nuevaCarpeta]);

    };



    return (
        <div className="w-full">
            <AddCarpetaModal
                open={open}
                onClose={() => setOpen(false)}
                existingCarpetas={listCarpetas} // simula BD/local
                handleCreate={handleCreateFolder}
            />
            <CustomSelect
                label="Carpeta"
                id={id}
                value={value}
                isOpen={isOpen}
                onToggle={onToggle}
                onChange={onChange}
                options={[
                    { value: "__addNew__", label: "➕ Agregar carpeta" },
                    ...listCarpetas
                ]}
                onClickNew={handleClickNew}
            />
        </div>
    )
}
