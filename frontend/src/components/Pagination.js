import React from 'react'

export default function Pagination({page, limit, flipPage, total, pageSpread}){

  const btnIsDisabled = () => (page+1) * limit >= total ;

  function pageBtnStyle(page, p){
    if(page + 1 === p) return "num--page current" 
    if (page + 1 !== p) {
     if(p >= 4 && p < pageSpread.length){
       return "invisible";
     } else return "num--page"; 
    }
  }

    return (
      <div className="page--btn--container">
        <button
          type="button"
          className="prev--page"
          disabled={page <= 0}
          onClick={() => flipPage(-1)}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        {pageSpread.map((p) => {
         if (p !== pageSpread.length-1) {
           return (
            <>
            {p > 4 && p === page+1 && p !== pageSpread.length && <span className="dotdotdot">...</span>}
             <button
               key={p}
               className={pageBtnStyle(page, p)}
               onClick={() => flipPage(p)}
             >
               {p}
             </button>
            </>
           );
         } 
           return (
            <>
               key={p}
            {p > 3 && <span className="dotdotdot">...</span>}
            <button
               className={pageBtnStyle(page, p)}
               onClick={() => flipPage(p)}
             >
               {p}
             </button>
            </>
           )  
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
