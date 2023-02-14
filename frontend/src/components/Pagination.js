import React from 'react'

export default function Pagination({page, limit, flipPage, total, pageSpread}){

  const btnIsDisabled = () => (page+1) * limit >= total ;
  
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
          return (
          <button
          key={p} 
          className={page+1 === p ? "num--page current" : "num--page"}
          onClick={()=>flipPage(p)}
          >
            {p}
            </button>
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
