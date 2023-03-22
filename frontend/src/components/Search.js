import React from 'react'

export default function Search({handleSearch, query, isLoading, handleSearchChange}) {
  return (
    <form aria-label="search bar" className="search--bar" onSubmit={handleSearch}>
      <input
        type="search"
        placeholder="search workouts..."
        value={query}
        onChange={handleSearchChange}
      ></input>
      <button disabled={isLoading}>
        <span className="material-symbols-outlined">search</span>
      </button>
    </form>
  );
}
