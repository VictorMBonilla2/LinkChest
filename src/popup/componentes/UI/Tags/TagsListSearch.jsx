import { memo, useEffect, useState } from "react";
import Tags from "./Tags";
import { obtenerTagsSearchByUser } from "@/services/Tags";
import { UseContextSearch } from "@/context/SearchContext";


function TagsListSearch({ onClickTag}) {  
    const [list, setList] = useState([]);
    const { lastEvent } = UseContextSearch();
    useEffect(()=>{
        async function fetchTagList() {
        
            try {
                const response = await obtenerTagsSearchByUser();

                setList(response)
            } catch (error) {
                console.error("Error interno al obtener Tags de Busqueda: ",error)
                setList([])
            }
        }

        fetchTagList()

    },([]))

    useEffect(() => {
    if (lastEvent?.type === "ENLACE_ELIMINADO") {
      // Re-fetch de tags para reflejar el cambio
      (async () => {
        const response = await obtenerTagsSearchByUser();
        setList(response);
      })();
    }
  }, [lastEvent]);

    const handleClickTag = (id)=> {


        onClickTag(id);

    }


    return (
        <div className="flex gap-2 overflow-hidden max-w-full ">
            {
            list.length ==0? (
                <p>Sin tags</p>
            ):

            list.map((t, i) => (
                <Tags key={t._id} id={t._id} tagName={t.name} i={i}  onClick={handleClickTag}/>
            ))}
        </div>
    );
}

export default memo(TagsListSearch);