import React from 'react'
import { useSearch } from '../hooks/useSearch';

export default function Search() {
    const {search} = useSearch();
    const [query, setQuery] = React.useState('');
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        await search(query)
    }
    return (
      <form className="search--bar" onSubmit={handleSubmit}>
        <input type="search" 
               placeholder="search..."
               value={query}
               onChange={e=>setQuery(e.target.value)}
               ></input>
        <button>
          <span className="material-symbols-outlined">search</span>
        </button>
      </form>
    );
}