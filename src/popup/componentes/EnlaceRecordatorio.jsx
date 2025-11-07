import { CalendarClock,  Clock4, MessageSquare } from 'lucide-react';
import React from 'react'
import TagsList2 from './UI/Tags/TagsList2';
import Chrome from './UI/icons/Chrome';
import { insertarClickEnlace } from '@/services/Enlaces';


function TextoAdaptativo( text ) {

  if(!text) return
  
  const clase =
    text.length > 40
      ? "text-normal"  // normal
      : "text-lg";   // grande

  return <p className={` pb-1 line-clamp-2 ${clase}`}>{text}</p>;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  // Función para obtener el lunes de la semana de una fecha
  function getMonday(d) {
    const day = d.getDay(); // 0 = domingo, 1 = lunes...
    const diff = (day === 0 ? -6 : 1 - day); // ajustar si es domingo
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
  }

  const mondayThisWeek = getMonday(now);
  const mondayDateWeek = getMonday(date);

  const isSameWeek = mondayThisWeek.toDateString() === mondayDateWeek.toDateString();

  // Formateo de hora
  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/\./g, ''); // quitar puntos si quieres P.M. en vez de p.m.

  if (isSameWeek) {
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
    return `${dayName}, ${time}`;
  } else {
    const dayMonthYear = date.toLocaleDateString('es-ES');
    return `${dayMonthYear}, ${time}`;
  }
}


export default function EnlaceRecordatorio({ page }) {
  const handleClickURL = async (page) => {
     await insertarClickEnlace(page._id)
    window.open(page.url, '_blank');
  }

  return (
    <>
      {/*Reference to @size */}
      <div className="@container" >
        <div className="w-full ">
          <div onClick={()=>{ handleClickURL(page) }} className="flex flex-col  h-[130px] w-full border border-(--aux2-color) rounded-lg p-2 @sm:w-7/8 @sm:mx-auto group transition hover:bg-slate-800 ">
            <div className="flex">
              {/*Page Image Area*/}
              <div className="img_container w-14 h-14 border   rounded-full border-(--aux2-color) flex justify-center items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" className="m-2 w-4/5 h-4/5 min-w-[44px] min-h-[44px]" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeDasharray="25" strokeDashoffset="25" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="25;0" /></path></svg>
              </div>
              {/*Page Text Area*/}
              <div className=" mx-5 ">
                <div className="name-link font-medium pb-1  ">
                  {TextoAdaptativo(page.titulo)}
                  <p className="font-extralight text-sm text-[#9F9FA6] w-[260px] pb-1  truncate ">{page.url}</p>
                </div>

                {/*
                   Tags Area 
                  page.tags &&
                  <div className="tags_container flex w-[250px] ">
                    <TagsList2 tags={page.tags} />
                  </div>
                */}


              </div>
              {/* opciones 
              <div className="options relative z-10 flex justify-center flex-1">
                <EllipsisVertical
                  className="transition hover:bg-slate-700 rounded-full p-1"
                  size={25}
                  onClick={(e) => { e.stopPropagation(); handleOpenMenu(e); }}
                />
              </div>
              */}
            </div>

            <div className="flex justify-center w-full px-2 gap-4  pt-2 ">

              <div className="timer_container flex items-center gap-2">
                {/*Clock SVG */}
                <CalendarClock style={{width:25, height:25, color:"var(--aux2-color)"}}/>
                <p className='font-extralight text-sm'>{page.tipoRecordatorio ? page.tipoRecordatorio : 'desconocido'}</p>
              </div>


              <div className="description_container flex  items-center gap-2">
                {/*Commentary SVG */}
                <Clock4 style={{width:25, height:25, color:"var(--aux2-color)"}}/>
                <p className='font-extralight text-sm'>{formatTimestamp(page.proximoAviso)}</p>
              </div>

              <div className="flex items-center gap-2 navigator_container">
                <Chrome
                  className="my-icon"
                  style={{ width: 25, height: 25, color: "var(--aux2-color)" }}
                />
                <p className='font-extralight text-sm'>Chrome</p>
              </div>

            </div>



          </div>
        </div>
      </div>
    </>
  )
}
