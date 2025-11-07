import React, { memo } from 'react'
import { Link } from 'react-router-dom'

 function SvgButton({link, children}) {

  
  return (
    <>  
    <Link to={link || ""} className='m-2 '>
        {children}
    </Link>    
    
    </>
  )
}
export default memo(SvgButton)
