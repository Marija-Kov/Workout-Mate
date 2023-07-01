import React from 'react'

 const CustomLegend = ({labels, colors}) => {
  return (
    <ul className="custom--legend">
        {labels.map((label, index) => (
           <li key={label+index} className="muscle--group">
             <span style={{backgroundColor: colors[index]}}></span>
               {label}
           </li> 
        ))
            
        }
    </ul>
  )
}

export default CustomLegend;
