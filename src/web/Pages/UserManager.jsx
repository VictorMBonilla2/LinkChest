import React, { useEffect, useState } from 'react'
import UserTable from '../Components/Features/UserTable'
import StadisticCard from '../Components/StadisticCard'
import { Link2, TrendingUp, UserPlus } from 'lucide-react'
import SearchFilterBar from '../Components/Features/SearchFilterBar'
import Paginador from '@/popup/componentes/features/Paginator'
import { sudoObtenerUsuariosPaginado } from '@/services/Users'

export default function UserManager() {


    const [dataTable, setDataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
  
    const [searchValue, setSearchValue] = useState("")
  
    useEffect(()=>{   
      console.log(searchValue);
      async function obtenerDatosTablaUsuarios() {
        
        const data = await sudoObtenerUsuariosPaginado (searchValue,currentPage)
        console.log(data);
        
        setDataTable(data.items)
        setTotalPage(data.totalPages)
  
      }
  
      obtenerDatosTablaUsuarios()
    },[searchValue,currentPage])
  

  return (
    <div>
      <h1 class="text-2xl text-white mb-6">Gestión de Usuarios</h1>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <StadisticCard data={{label:"Total Usuarios", number:9, color:"blue"}}>
          <UserPlus/>
        </StadisticCard>
        <StadisticCard data={{label:"Usuarios Activos", number:7, color:"green"}}>
        <TrendingUp />
        </StadisticCard>

        <StadisticCard data={{label:"Nuevos (7 días)", number:0, color:"purple"}}>
          <UserPlus/>
        </StadisticCard>

        <StadisticCard data={{label:"Usuarios Activos", number:478, color:"orange"}}>
            <TrendingUp />
        </StadisticCard>
      </div>


      <SearchFilterBar metodo={(e)=>{setSearchValue(e)} }/>
      <UserTable  data={dataTable}/>
      <Paginador totalPages={totalPage} onPageChange={(value)=> setCurrentPage(value)}/>

    </div>
  )
}
