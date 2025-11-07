import React, { useState } from 'react'

export default function Tags({ id ,tagName, onClick }) {

    const[selected, setSelected] = useState(false);
    const handleClick = (e) => {
        setSelected(prev => !prev);  //Evita errores en renders rapidos
        onClick?.(id, e);           
    };

    return (
        <span
            onClick={handleClick}
            className={`tag-item border border-transparent rounded-lg bg-(--aux2-color) 
                ${onClick ? "cursor-pointer" : ""} 
                ${selected ? "ring-2 ring-blue-400 shadow-lg shadow-blue-300" : ""}`}
        >
            <p className="font-light text-xs mx-3 my-1">{tagName}</p>
        </span>
    );
}
