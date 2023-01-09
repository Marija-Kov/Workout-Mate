import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutContext';

export default function Pagination({page, limit, flipPage}){
  const {workouts} = useWorkoutsContext();

  const btnIsDisabled = () => workouts ? workouts.length < limit : true ;
  
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
        <button
          type="button"
          className="next--page"
          disabled={btnIsDisabled()}
          onClick={() => flipPage(1)}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    );
}

// disable next on the last page
// calculate the last page