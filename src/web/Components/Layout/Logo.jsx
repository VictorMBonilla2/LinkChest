import React from 'react'
import logo from "../../../assets/logo.svg";
export default function Logo({className}) {
    return (
        <div className={`logo_Container w-16 h-16 border-2 mt-1 rounded-full border-(--aux2-color) flex justify-center items-center ${className} `}>
            <img src={logo} alt="" className="m-2 w-4/5 h-4/5" />
        </div>
    )
}
