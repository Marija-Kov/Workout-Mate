import React from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutContext';
import { useAuthContext } from '../hooks/useAuthContext';

export default function WorkoutForm(props){

  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [load, setLoad] = React.useState('');
  const [error, setError] = React.useState(null);
  const [emptyFields, setEmptyFields] = React.useState([]);
// When you're overwhelmed with new info you can (temporarily) forget what you already know. This is a natural defense mechanism.
 const handleSubmit = async (e) => {    
   e.preventDefault();
   if(!user){
    setError('You must be logged in to do that')
    return
   }
   const workout = {title, load, reps};  // because workouts is an array of objects with title, reps and load properties;
   const response = await fetch('/api/workouts', {
       method: 'POST',
       body: JSON.stringify(workout), // request body is an OBJECT that needs to be turned into JSON string
       headers: {
        'Content-Type': 'application/json', // here we state that the content type is going to be JSON
        'Authorization': `Bearer ${user.token}`
      } 
    });
    const json = await response.json(); // turns JSON into object and reads it
 
    if (!response.ok) {
      setError('Please fill out the empty fields')
      // setError(json.error);
      // setEmptyFields(json.emptyFields)
    }
    if (!title){
      setEmptyFields(prev => ['title', ...prev])
    }
    if (!reps){
      setEmptyFields(prev => ['reps', ...prev])
    }
    if (!load){
      setEmptyFields(prev => ['load', ...prev])
    }
    if (response.ok){
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        console.log('new workout added', json)
        dispatch({type: 'CREATE_WORKOUT', payload: json})
        props.hideForm();
    }
 }

    return (
      <form className="workout--form" onSubmit={handleSubmit}>
          <h4>New workout</h4>
          <label>exercise title:</label>
          <input 
            type="text" 
            name="title" 
            id="title" 
            placeholder="ex: bench press"
            onChange={e=> setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes('title') ?
                   'error' : ''}
            />
        <label>number of reps:</label>
          <input 
            type="number" 
            name="reps" 
            id="reps" 
            onChange={e=> setReps(e.target.value)}
            value={reps}
            className={emptyFields.includes('reps') ?
                   'error' : ''}
            />
        <label>load (kg):</label>
          <input 
            type="number" 
            name="load" 
            id="load" 
            onChange={e=> setLoad(e.target.value)}
            value={load}
            className={emptyFields.includes('load') ?
                   'error' : ''}
            />
       <p className="checky">
       <input type="checkbox" />
       <label>I am not making this up</label>
       </p>
       <div className="btns">
       <button>Add workout</button>  
        <button className="discard" onClick={()=> props.hideForm()}>Not now</button>
       </div>
       {error && <div className="error">{error}</div>}   
      </form>
      
    )
}
