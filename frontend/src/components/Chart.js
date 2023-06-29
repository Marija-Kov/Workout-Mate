import React from 'react'

export const Chart = () => {
  return (
    <div className="chart--container">
     <h3>Routine Balance</h3>
     <div className="chart"></div>
     <div className="chart--legend">
       <p className="stats--upper-bod">
        <span></span> Upper body: 64%
       </p>
       <p className="stats--lower-bod">
        <span></span> Lower body: 36%
       </p>              
     </div>
    </div>
  )
}
