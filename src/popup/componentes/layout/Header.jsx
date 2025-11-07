import React, { memo } from 'react'

import { Link } from 'react-router-dom';
import HeaderSlots from './HeaderSlots';
import Logo from './Logo';
function Header({ left ,title, children }) {
  
    return (
        <>

            <HeaderSlots
                left={ left||<Logo/>}

                center={
                <div className="name_Section_header  pl-8">
                    <p className="text-2xl  font-bold">{title}</p>
                </div>

                }

                right={children}
            />

        </>
    )
}

export default memo(Header)
