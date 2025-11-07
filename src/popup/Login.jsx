import React, { useState } from 'react'
import Header from './componentes/layout/Header'
import HeaderSlots from './componentes/layout/HeaderSlots'
import Logo from './componentes/layout/Logo'
import GoogleLogin from './componentes/features/GoogleLogin'
import EmailLogin from './componentes/features/EmailLogin'

export default function Login() {

    const [isRegistering, setIsRegistering] = useState(false);


    const handleOnRegisterClick =  () => {
        setIsRegistering(!isRegistering);

    }



    return (
        <div className='bg_popup'>

            <HeaderSlots
             right=  {<svg xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="0 0 24 24"><path fill="currentColor" d="M15.333 9.5A3.5 3.5 0 0 0 8.8 7.75a1 1 0 0 0 1.733 1a1.5 1.5 0 0 1 1.3-.75a1.5 1.5 0 1 1 0 3h-.003a1 1 0 0 0-.19.039a1 1 0 0 0-.198.04a1 1 0 0 0-.155.105a1 1 0 0 0-.162.11a1 1 0 0 0-.117.174a1 1 0 0 0-.097.144a1 1 0 0 0-.043.212a1 1 0 0 0-.035.176v1l.002.011v.491a1 1 0 0 0 1 .998h.003a1 1 0 0 0 .998-1.002l-.002-.662A3.49 3.49 0 0 0 15.333 9.5m-4.203 6.79a1 1 0 0 0 .7 1.71a1.04 1.04 0 0 0 .71-.29a1.015 1.015 0 0 0 0-1.42a1.034 1.034 0 0 0-1.41 0" /></svg>}
            />
            
            <div className="flex flex-col justify-center items-center gap-3">
                
                 <div className="flex justify-center flex-col mx-auto gap-2  items-center text-[var(--aux1-color)] font-bold text-xl">
                    <Logo className={"w-25 h-25 bg-[#42434F] border-black"} />

                    <span className=''>LinkChest</span>
                </div>

                <div className=" w-3/5">

                    <EmailLogin isRegistering={isRegistering} />

            
                <div className="flex items-center my-5">
                    <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-3 text-gray-500 text-sm font-medium">o</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                    {//DEV O PROD
                    import.meta.env.DEV &&
                    <GoogleLogin /> 
                    
                    }

                <p className="text-center mt-6 text-sm text-gray-500"> { !isRegistering? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}  {" "}
                    <span
                        onClick={ ()=> handleOnRegisterClick()}
                        className="font-semibold text-[var(--aux1-color)] hover:underline hover:text-[var(--aux2-color)] transition-colors cursor-pointer"
                    >
                        { !isRegistering? "Regístrate" : "Inicia sesión"}
                    </span>
                </p>
                </div>
            </div>
        </div>
    )
}
