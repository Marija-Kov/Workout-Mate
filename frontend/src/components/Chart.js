import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import CustomLegend from "./CustomLegend.js"

ChartJS.register(ArcElement, Tooltip);

export const Chart = ({muscleGroups}) => {
   const [chest, setChest] = useState(null);
   const [shoulder, setShoulder] = useState(null);
   const [biceps, setBiceps] = useState(null);
   const [triceps, setTriceps] = useState(null);
   const [leg, setLeg] = useState(null);
   const [back, setBack] = useState(null);
   const [glute, setGlute] = useState(null);
   const [ab, setAb] = useState(null);
   const [calf, setCalf] = useState(null);
   const [forearmAndGrip, setForearmAndGrip] = useState(null);

   useEffect(() => routineBalance(muscleGroups), [muscleGroups])

   const routineBalance = (muscleGroups) => {
    const all = muscleGroups;
    const total = all.length;
    const chest = all.filter(e => e === 'chest').length * 100 / total;
    setChest(chest.toFixed(1));
    const shoulder = all.filter(e => e === 'shoulder').length * 100 / total;
    setShoulder(shoulder.toFixed(1));
    const biceps = all.filter(e => e === 'biceps').length * 100 / total;
    setBiceps(biceps.toFixed(1));
    const triceps = all.filter(e => e === 'triceps').length * 100 / total;
    setTriceps(triceps.toFixed(1));
    const leg = all.filter(e => e === 'leg').length * 100 / total;
    setLeg(leg.toFixed(1));
    const back = all.filter(e => e === 'back').length * 100 / total;
    setBack(back.toFixed(1));
    const glute = all.filter(e => e === 'glute').length * 100 / total;
    setGlute(glute.toFixed(1));
    const ab = all.filter(e => e === 'ab').length * 100 / total;
    setAb(ab.toFixed(1));
    const calf = all.filter(e => e === 'calf').length * 100 / total;
    setCalf(calf.toFixed(1));
    const forearmAndGrip = all.filter(e => e === 'forearm and grip').length * 100 / total;
    setForearmAndGrip(forearmAndGrip.toFixed(1));
    return 
   }

  const data = {
    labels: ["Chest", "Shoulder", "Biceps", "Triceps", "Leg", "Back", "Glute", "Ab", "Calf", "Forearm and Grip"],
    datasets: [
      {
        data: [chest, shoulder, biceps, triceps, leg, back, glute, ab, calf, forearmAndGrip],
        backgroundColor: [
          "rgb(219, 162, 215, 0.7)", 
          "rgb(212, 122, 147, 0.7)", 
          "rgb(162, 122, 212, 0.7)", 
          "rgb(122, 131, 212, 0.7)", 
          "rgb(99, 148, 255, 0.7)", 
          "rgb(99, 224, 255, 0.7)", 
          "rgb(99, 255, 239, 0.7)", 
          "rgb(99, 255, 140, 0.7)", 
          "rgb(255, 206, 99, 0.7)", 
          "rgb(255, 127, 99, 0.7)"
        ],
        borderWidth: 1,
        borderColor: "rgb(255, 255, 255, 0.001)"
      }
    ]
  }

  Tooltip.positioners.myCustomPositioner = () => { 
    return window.innerWidth <= 450 ? {x: 80, y: 100} : {x: 100, y: 150};
  };

  const options = {
    onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement.length ? "pointer" : "default";
    },
    plugins: {
      legend: false,
      tooltip: {
        position: 'myCustomPositioner',
        displayColors: false,
        backgroundColor: "rgb(255, 255, 255, 0.7)",
        titleColor: "rgb(112, 98, 109)",
        bodyColor: "rgb(48, 48, 48)",
        titleFont: {
          family: "Poppins",
          weight: 600,
          size: 14
        },
        bodyFont: {
          family: "Poppins",
          weight: 600,
          size: 14
        },
        
      }
    }
  
  }

  return (
    <div className="chart--container">
      <h3>Routine balance (%)</h3>
      <div className="chart" aria-label="routine balance chart">  
         <Doughnut data={data} options={options} />
         <CustomLegend 
          labels={data.labels} 
          colors={data.datasets[0].backgroundColor} 
          percentage={data.datasets[0].data}
          />
      </div>
    </div>
  )
}
