import React from 'react'

export default function Search(){

    return (
      <div className="search--bar">
        <input type="text" placeholder="search..."></input>
        <button>
          <span class="material-symbols-outlined">search</span>
        </button>
      </div>
    );
}