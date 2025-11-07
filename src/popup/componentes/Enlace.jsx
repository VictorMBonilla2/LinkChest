import React, { memo } from 'react'
import TagsList2 from './UI/Tags/TagsList2';
import { CalendarClock, Clock4, EllipsisVertical, MessageSquare } from 'lucide-react';
import { insertarClickEnlace } from '@/services/Enlaces';


function TextoAdaptativo( text ) {

  if(!text) return
  
  const clase =
    text.length > 30
      ? "text-base"  // normal
      : "text-lg";   // grande

  return <p className={` pb-1 line-clamp-2 ${clase}`}>{text}</p>;
}

function Enlace({ page, handleOpenMenu }) {

  const handleClickURL = async (page) => {
    await insertarClickEnlace(page._id)
    window.open(page.url, '_blank');
  }

  return (
    <>

      {/*Reference to @size */}
      <div className="@container" onClick={()=>{ handleClickURL(page) }}>
        <div className="w-full ">
          <div className="item_link_container flex flex-col h-[155px] w-full border border-(--aux2-color) rounded-lg p-2 @lg:w-3/4 @lg:mx-auto group transition hover:bg-slate-800 ">
            <div className="top_container_item_link flex  ">
              {/*Page Image Area*/}
              <div className="img_container w-14 h-14 border   rounded-full border-(--aux2-color) flex justify-center items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" className="m-2 w-4/5 h-4/5 min-w-[44px] min-h-[44px]" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeDasharray="28" strokeDashoffset="28" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2" d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="28;0" /></path></svg>
              </div>
              {/*Page Text Area*/}
              <div className="text_container pl-2  flex-2  w-[270px] ">
                <div className="name-link font-medium pb-1  ">
                  {TextoAdaptativo(page.titulo)}
                  <p className="font-extralight text-sm text-[#9F9FA6] w-[260px] pb-1  truncate ">{page.url}</p>
                </div>

                {
                  /* Tags Area */
                  page.tags &&
                  <div className="tags_container flex w-[300px] ">
                    <TagsList2 tags={page.tags} />
                  </div>
                }


              </div>
              {/* opciones */}
              <div className="options relative z-10 flex justify-center flex-1">
                <EllipsisVertical
                  className="transition hover:bg-slate-700 rounded-full p-1"
                  size={25}
                  onClick={(e) => { e.stopPropagation(); handleOpenMenu(e); }}
                />
              </div>
            </div>

            <div className="footer_container_item_link flex flex-initial px-2 gap-4  pt-2 mt-auto">

              <div className="timer_container flex items-center gap-2">
                {/*Clock SVG */}
                <CalendarClock style={{width:25, height:25, color:"var(--aux2-color)"}}/>
                <p className='font-extralight text-xs'>{page.tipoRecordatorio ? page.tipoRecordatorio : 'desconocido'}</p>
              </div>


              <div className="description_container flex  items-center gap-2">
                {/*Commentary SVG */}
                <MessageSquare style={{width:25, height:25, color:"var(--aux2-color)"}}/>
                <p className='font-extralight text-xs'>{page.descripcion?  page.descripcion : "Sin descripción"}</p>
              </div>

              <div className="navigator_container">
                <img src={null} alt="" />
              </div>

            </div>



          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Enlace)