import React from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutContext';

export default function WorkoutForm(){

  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [load, setLoad] = React.useState('');
  const [error, setError] = React.useState(null);

 const handleSubmit = async (e) => {
  const [emptyFields, setEmptyFields] = React.useState([]);
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
      // setError('Please fill out the empty fields')
      setError(json.error);
      setEmptyFields(json.emptyFields)
    }
    // if (!title){
    //   setEmptyFields(prev => ['title', ...prev])
    // }
    // if (!reps){
    //   setEmptyFields(prev => ['reps', ...prev])
    // }
    // if (!load){
    //   setEmptyFields(prev => ['load', ...prev])
    // }
    if (response.ok){
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        console.log('new workout added', json)
        dispatch({type: 'CREATE_WORKOUT', payload: json})
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
            className={emptyFields.includes('title') ?
                   'error' : ''}
            />
        <label>Number of reps:</label>
          <input 
            type="number" 
            name="reps" 
            id="reps" 
            onChange={e=> setReps(e.target.value)}
            value={reps}
            className={emptyFields.includes('reps') ?
                   'error' : ''}
            />
        <label>Load (kg):</label>
          <input 
            type="number" 
            name="load" 
            id="load" 
            onChange={e=> setLoad(e.target.value)}
            value={load}
            className={emptyFields.includes('load') ?
                   'error' : ''}
            />
       <button>Add Workout</button>  
       {error && <div className="error">{error}</div>}   
      </form>
      
    )
}
