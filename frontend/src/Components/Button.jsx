import React from 'react'
import "./Button.css"
function Button({children}) {
  return (
    <button className='customised_button'>{children}</button>
  )
}

export default Button