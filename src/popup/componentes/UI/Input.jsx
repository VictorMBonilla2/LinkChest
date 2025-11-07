import React from 'react'

export default function Input({label, type="text", form , error, className }) {
    //TODO reemplazar por el textField de Material UI.

    return (
        <div className={className}>
            {label && (
            <label className="block pl-3 font-regular">{label}</label>
            )}
            <input
                type={type}
                {...form}
                className={`border border-transparent bg-(--aux2-color) rounded-[15px] p-2 w-full ${error ? "border-red-500" : "border-gray-300"
                    }`}
            />
            {error && (
                <p className="text-red-500 text-sm">{error.message}</p>
            )}
        </div>
    )
}
