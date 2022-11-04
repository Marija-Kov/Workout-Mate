import React from 'react'

export default function Pagination({page, limit, currPageItemsNum, flipPage}){

    return (
      <div className="page--btn--container">
        <button 
        type="button" 
        className="prev--page" 
        disabled={page <= 0}
        onClick={() => flipPage(-1)}>
          prev
        </button>
        <button 
        type="button" 
        className="next--page"
        disabled={currPageItemsNum<limit} 
        onClick={() => flipPage(1)}>
          next
        </button>
      </div>
    );
}

// disable next on the last page
// calculate the last page