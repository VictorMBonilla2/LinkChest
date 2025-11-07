import React, { useEffect,  useState } from 'react'
import EnlacesTable from '../Components/Features/EnlacesTable'
import StadisticCard from '../Components/StadisticCard'
import { Eye, Link2, TrendingUp } from 'lucide-react'
import SearchFilterBar from '../Components/Features/SearchFilterBar'
import { sudoObtenerEnlacesPaginado } from '@/services/Enlaces'

import Paginador from '@/popup/componentes/features/Paginator'

export default function EnlaceManager() {
  
  const [dataTable, setDataTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [searchValue, setSearchValue] = useState("")

  useEffect(()=>{   
    console.log(searchValue);
    async function obtenerDatosTablaEnlace() {
      
      const data = await sudoObtenerEnlacesPaginado(searchValue,currentPage)
      console.log(data);
      
      setDataTable(data.items)
      setTotalPage(data.totalPages)

    }

    obtenerDatosTablaEnlace()
  },[searchValue,currentPage])


  return (
    <div>
      <h1 class="text-2xl text-white mb-6">Gestión de Enlaces</h1>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <StadisticCard data={{label:"Total Usuarios", number:9, color:"blue"}}>
          <Link2 />
        </StadisticCard>
        <StadisticCard data={{label:"Usuarios Activos", number:7, color:"green"}}>
       <TrendingUp />
        </StadisticCard>

        <StadisticCard data={{label:"Nuevos (7 días)", number:0, color:"purple"}}>
             <Eye />
        </StadisticCard>

        <StadisticCard data={{label:"Usuarios Activos", number:478, color:"orange"}}>
            <TrendingUp />
        </StadisticCard>
      </div>

      <SearchFilterBar metodo={(e)=>{setSearchValue(e)} }/>

      <EnlacesTable data={dataTable}   />
      <Paginador totalPages={totalPage} onPageChange={(value)=> setCurrentPage(value)}/>
    </div>
  )
}
