import React, { useEffect, useState, useCallback, useMemo  } from 'react'
import Header from './componentes/layout/Header'
import { Link, useNavigate } from 'react-router-dom'
import Explorer from './componentes/layout/Explorer'
import Enlace from './componentes/Enlace'
import SvgButton from './componentes/UI/SvgButton'
import { eliminarEnlace, obtenerEnlacesbySearch } from "@/services/Enlaces";
import Input from './componentes/UI/Input'
import InputMaterialUI from './componentes/UI/Inputs/InputMaterialUI'
import TagsListSearch from './componentes/UI/Tags/TagsListSearch'
import { UseContextSearch } from '@/context/SearchContext'
import MenuEnlace from './componentes/UI/MenuEnlace'
import { useForm } from 'react-hook-form'
import Paginador from './componentes/features/Paginator'



export default function Search() {
  const [dataList, setDataList] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);   // único estado para controlar menú
  const [menuTargetId, setMenuTargetId] = useState(null); // id del enlace que abrió el menú
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { lastEvent, emitChange } = UseContextSearch();
  const navigate = useNavigate();
  
  const { register, watch } = useForm({ })
  const formSearch = useMemo(() => register("search"), [register]);

  const searchValue = watch("search");
  useEffect(() => {
    
    // Si es la primera vez que entra, ejecuta de inmediato
   /* if (firstRunRef.current) {

      firstRunRef.current = false;
      (async () => {
        const lista = await obtenerEnlacesbySearch(searchValue, tagsSelected);
        console.log(lista);
        
        setDataList(lista.items);
      })();
      return; // Evita que entre al debounce
    }*/

    const timer = setTimeout(async () => {
        const lista = await obtenerEnlacesbySearch(searchValue, tagsSelected, currentPage);
        console.log(lista);
        setTotalPage(lista.totalPages);
        setDataList(lista.items);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchValue,tagsSelected, currentPage]);


  const handleClickTag = useCallback((idTag) => {
    setTagsSelected((prev) =>
      prev.includes(idTag)
        ? prev.filter((id) => id !== idTag)
        : [...prev, idTag]
    );
  }, [setTagsSelected]);


  const handleDeleteLink = useCallback( async (idEnlace) => {
    const isDeleted = await eliminarEnlace(idEnlace)
    if (isDeleted) {
      setDataList((prev) => prev.filter((item) => item._id !== idEnlace));
      emitChange({ type: "ENLACE_ELIMINADO", payload: { id: idEnlace } });
    }
  }, [emitChange]);

  const handleEditLink = useCallback( async (idEnlace)=>{

    navigate(`/edit/${idEnlace}`);

  }, [navigate]);

  useEffect(() => {
     if (lastEvent?.type === "ENLACE_ELIMINADO") {
    const idEliminar = lastEvent.payload.id;
    setDataList(prev => {
      const nuevaLista = prev.filter(item => item._id !== idEliminar);

      // Si al eliminar, la lista actual queda vacía
      if (nuevaLista.length === 0 && currentPage > 1) {
        // Mover al usuario a la página anterior
        setCurrentPage(prev => prev - 1);
      }

      return nuevaLista;
    });

    // Ajustar el total de páginas localmente
    setTotalPage(prev => {
      // Caso simple: cada página tiene N elementos
      // totalItems = prev * itemsPerPage
      // Si eliminamos un elemento, recalculamos
      const totalItemsAprox = prev * 10 - 1;
      return Math.max(1, Math.ceil(totalItemsAprox / 10));
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);

  const handleOpen = (e, pageId) => {
    setAnchorEl(e.currentTarget);
    setMenuTargetId(pageId);
  };
  const handleClose = useCallback( () => {
    setAnchorEl(null);
    setMenuTargetId(null);
  }, []);

  const handleMenuClick = useCallback((action) => {
    if (action === "delete") handleDeleteLink(menuTargetId);
    if (action === "edit") handleEditLink(menuTargetId);
}, [handleDeleteLink, handleEditLink, menuTargetId]); 

  return (
    <div className="bg_popup overflow-y-hidden">
      <Header title={"Buscar Paginas"}>
        <SvgButton link={"../"} children= {<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24"><path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z" /></svg>} />
      </Header>
      <div className="flex h-133 py-4">
        <div className=" mr-1.5">
          <Explorer />
        </div>
        <main className="flex flex-col gap-3 flex-1 w-1">
          <div>
            <div className="search_input_container">
              <InputMaterialUI  form={formSearch}  placeholder='Busca una pagina'/>
              <hr className="border-t border-gray-400 my-4" />
            </div>
            <div>
              <p className="font-bold text-sm pb-3">Tags</p>
              <TagsListSearch onClickTag={handleClickTag} />
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-x-hidden max-h-80">
            {dataList.map((page) => (
              <Enlace
                key={page._id}
                page={page}
                handleOpenMenu={(e) => handleOpen(e, page._id)}
              />
            ))}
          </div>
            <Paginador totalPages={totalPage} onPageChange={(value)=> setCurrentPage(value)}/>

          {/* 🔽 Un solo MenuEnlace compartido */}
          <MenuEnlace
            anchorEl={anchorEl}
            handleClose={handleClose}
            handleClick={handleMenuClick}
          />
        </main>
      </div>
    </div>
  );
}
