import React from 'react'
import uuid from "react-uuid"
export default function Pagination({page, limit, flipPage, total, pageSpread}){

  const btnIsDisabled = () => (page+1) * limit >= total ;

  function pageBtnStyle(page, p){
     if (page + 1 === p){
      if(p - 3 > 1 && pageSpread.length - p > 1) return "num--page current dots-left dots-right";
      if(pageSpread.length - p > 1 && p > 2) return "num--page current dots-right";
      if(p - 3 > 1) return "num--page current dots-left";
      return "num--page current";
     }
    if (page + 1 !== p) {
      if (p > 3 && p !== pageSpread.length) return "invisible";
      if (p === pageSpread.length && p < pageSpread.length-1) return "num--page dots-left";
      if (p === 3 && pageSpread.length > 4 && page + 1 < 3) return "num--page dots-right";
      if (p <= 3 || p === pageSpread.length) return "num--page"; 
    }
  }
    return (
      <div aria-label="pages" className="page--btn--container">
        <button
          type="button"
          className="prev--page"
          disabled={page <= 0}
          onClick={() => flipPage(-1)}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        {pageSpread.map((p) => {
           return (
             <button
               key={uuid()}
               className={pageBtnStyle(page, p)}
               onClick={() => flipPage(p)}
             >
               {p}
             </button>
           );  
        })}
        <button
          type="button"
          className="next--page"
          disabled={btnIsDisabled()}
          onClick={() => flipPage([1])}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    );
}
