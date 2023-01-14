import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutContext';

export default function Pagination({page, limit, flipPage, total}){
  const {workouts} = useWorkoutsContext();

  const spreadPages = (t,l) => {
    const pagesNum = Math.ceil(t/l);
    let spread = [];
    for(let i=1; i<=pagesNum; ++i){
      spread.push(i)
    }
    return spread
    }
  let pageSpread = spreadPages(total,limit);
  // TODO: use total number of items to enable/disable prev/next page buttons to avoid showing blank page 
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
