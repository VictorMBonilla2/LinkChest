import { LinkOffOutlined, LinkOutlined } from '@mui/icons-material'
import { ChartColumn, Link, Link2, Users, Users2 } from 'lucide-react'
import React from 'react'
import AsideButton from '../AsideButton'
import Logo from './Logo'


export default function Sidebar({asideSelected, setAsideSelected}) {


    const handleClickAsideButton = (aside) => {
        setAsideSelected(aside)
    }

    return (
        <aside className="w-20 bg-[#13151f] flex flex-col items-center py-6 gap-6">
            
                <Logo/>
            
            <AsideButton onClick={() => handleClickAsideButton("usuarios")} isSelected={asideSelected === "usuarios"}>
                <Users />
            </AsideButton>


            <AsideButton onClick={() => handleClickAsideButton("enlaces")} isSelected={asideSelected === "enlaces"}>
                <Link2 size={28} />
            </AsideButton>



            <AsideButton onClick={() => handleClickAsideButton("estadisticas")} isSelected={asideSelected === "estadisticas"}>
                <ChartColumn size={28} />
            </AsideButton>


        </aside>
    )
}
