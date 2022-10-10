import React from 'react';
import {Link} from 'react-router-dom';

export default function Navbar(){

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>WorkoutMate</h1>
                </Link>
                <span className='material-symbols-outlined ham'>
                    menu
                </span>
            </div>
        </header>
    )
}