import { useEffect, useState } from 'react'

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
    // const all = workouts.map(workout => workout.muscle_group);
    console.log('routineBalance runs')
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
      
  return (
    <div className="chart--container">
     <h3>Routine Balance</h3>
     <div className="chart"></div>
     <div className="chart--legend">
       <p className="stats--upper-bod">
        <span></span> chest:{chest}%
       </p>
       <p className="stats--lower-bod">
        <span></span> Lower body: 36%
       </p>              
     </div>
    </div>
  )
}
