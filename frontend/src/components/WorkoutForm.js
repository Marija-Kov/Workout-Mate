import React from 'react';

export default function WorkoutForm(){
  const [title, setTitle] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [load, setLoad] = React.useState('');
  const [error, setError] = React.useState(null);

 const handleSubmit = async (e) => {
   e.preventDefault();
   const workout = {title, load, reps};
   const response = await fetch('/api/workouts', {
       method: 'POST',
       body: JSON.stringify(workout), // request body is an OBJECT that needs to be turned into JSON string
       headers: {
        'Content-Type': 'application/json' // here we state that the content type is going to be JSON
       } 
    });
    const json = await response.json(); // turns JSON into object
    
    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok){
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        console.log('new workout added', json)
    }
 }

    return (
      <form className="create" onSubmit={handleSubmit}>
          <h3>Add a new workout</h3>
          <label>Exercise title:</label>
          <input 
            type="text" 
            name="title" 
            id="title" 
            onChange={e=> setTitle(e.target.value)}
            value={title}
            />
        <label>Number of reps:</label>
          <input 
            type="number" 
            name="reps" 
            id="reps" 
            onChange={e=> setReps(e.target.value)}
            value={reps}
            />
        <label>Load (kg):</label>
          <input 
            type="number" 
            name="load" 
            id="load" 
            onChange={e=> setLoad(e.target.value)}
            value={load}
            />
       <button>Add Workout</button>  
       {error && <div className="error">{error}</div>}   
      </form>
      
    )
}
