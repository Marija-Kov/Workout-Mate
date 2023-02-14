import React from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutContext';
import { useAuthContext } from '../hooks/useAuthContext';

export default function EditWorkout(props){
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [title, setTitle] = React.useState(props.title);
  const [reps, setReps] = React.useState(props.reps);
  const [load, setLoad] = React.useState(props.load);
  const [error, setError] = React.useState(null);
  const [emptyFields, setEmptyFields] = React.useState([]);

 const handleUpdate = async (e) => {    
   e.preventDefault();
   if(!user){
      setError('You must be logged in to do that')
      return
    }
   const response = await fetch('/api/workouts/'+ props.id, {
       method: 'PATCH',
       body: JSON.stringify({
           title: title,
           reps: reps,
           load: load
       }), 
       headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}` 
       } 
    });
    const json = await response.json(); 
   console.log(json)
    if (!response.ok) {
      setError('Please fill out the empty fields')
      if (!title){
      setEmptyFields(prev => ['title', ...prev])
    }
    if (!reps){
      setEmptyFields(prev => ['reps', ...prev])
    }
    if (!load){
      setEmptyFields(prev => ['load', ...prev])
    }
    }
    
    if (response.ok){
        setEmptyFields([]);
        console.log('workout updated', json)
        props.showEdit();
        dispatch({type: 'UPDATE_ONE', payload: json})
    }
 }
    return (
      <form className="edit--form">
        <span
          className="close--user--settings material-symbols-outlined"
          onClick={() => props.showEdit()}
        >
          close
        </span>
        <h4>Edit workout</h4>
        <label>exercise title:</label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields.includes("title") ? "error" : ""}
        />
        <label>number of reps:</label>
        <input
          type="number"
          name="reps"
          id="reps"
          onChange={(e) => setReps(e.target.value)}
          value={reps}
          className={emptyFields.includes("reps") ? "error" : ""}
        />
        <label>load (kg):</label>
        <input
          type="number"
          name="load"
          id="load"
          onChange={(e) => setLoad(e.target.value)}
          value={load}
          className={emptyFields.includes("load") ? "error" : ""}
        />
        <div className="btns">
          <button onClick={(e) => handleUpdate(e)}>Save changes</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    );
}