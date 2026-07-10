import React from 'react';
import "./Form.css";

function Form({ children, onSubmit, ...rest }) {
  return (
    <form 
      className='Customised_form' 
      onSubmit={(e)=>{e.preventDefault()}}
      {...rest}
    >
      {children}
    </form>
  );
}

export default Form;
