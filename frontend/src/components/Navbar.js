import React from 'react';
import {Link} from 'react-router-dom';
import Menu from './Menu';

export default function Navbar(){
   const [dropdown, setDropdown] = React.useState(false);

   function setDrop(){
       setDropdown(prev => !prev)
   }
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>WorkoutMate</h1>
                </Link>
                <span className='material-symbols-outlined ham'
                      onClick={()=>setDrop()}>
                    menu
                </span>
                {dropdown &&  
                <Menu 
                setDropdown={()=>setDrop()}
                /> 
                }
                
            </div>
        </header>
    )
}