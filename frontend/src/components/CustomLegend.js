import React from 'react'

 const CustomLegend = ({labels, colors, percentage}) => {
  return (
    <ul className="custom--legend" aria-label="chart legend">
        {labels.map((label, index) => (
           <li key={label+index} 
               className={percentage[index] > 0 ? "muscle--group" : "muscle--group zero--percent"}
               aria-label={`${percentage[index]}% ${label} workouts`}
               >
             <span style={{backgroundColor: colors[index]}}></span>
               {label}
           </li> 
        ))
            
        }
    </ul>
  )
}

export default CustomLegend;
