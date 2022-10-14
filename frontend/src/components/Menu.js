import React from 'react';
import {Link} from 'react-router-dom';

export default function Menu(props){
    return (
      <div className='menu'>
       <span>Log in</span>
       <Link to="/">
       <span>SIGN OUT</span> 
       </Link> 
       <span className='close' 
            onClick={()=>props.setDropdown()}>X</span>
      </div>
    )
}