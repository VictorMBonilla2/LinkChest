import React from 'react'

export default function AsideButton({isSelected, onClick, children }) {


    const StyleButton=  isSelected?`bg-blue-600 text-white  ` :` bg-[#1a1d2e] text-gray-400 hover:text-white`
  //Animar sidebar
  return (

    <button onClick={onClick} className={`relative w-18 h-12 rounded-xl flex items-center justify-center transition-colors   `}>
        
        {isSelected ? 
        <>
          <div className="z-10 absolute bg-[var(--bg-color)] w-4 h-3 -top-4.5 left-15 ">
            <div className='bg-[#13151f]  w-full h-full rounded-br-full'></div>   
          </div>
          <div className="z-10 absolute bg-[var(--bg-color)] rotate-270 w-4 h-3 top-14 left-15.5 ">
            <div className='bg-[#13151f]  w-full h-full rounded-br-full'></div>   
          </div>
          <div className=" z-1 absolute -top-1.5  left-0 w-22 h-15 rounded-xl flex items-center justify-center transition-colors   bg-[var(--bg-color)]"></div>
          </>
          
          :
          null}       
        <div className={` z-10 w-13 h-12 rounded-xl flex items-center justify-center transition-colors ${StyleButton}`}>
          {children}
        </div>

    </button>


  )
}
