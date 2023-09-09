import React from 'react'
import whitelogo from '../images/tinder_logo_white.png'
import colorlogo from '../images/color-logo-tinder.png'


const Nav = ({minimal,autotoken}) => {

 
  return (
    <nav>
     <div className='logo-container'>
          <img className='logo' src={minimal ? colorlogo:whitelogo}/>
     </div>
     {!autotoken && !minimal && <button className="nav-button"> Log in </button>}
    </nav>
  )
}

export default Nav
