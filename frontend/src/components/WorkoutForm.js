import React from 'react';
import { useCreateWorkout } from '../hooks/useCreateWorkout';
import { useDispatch, useSelector } from 'react-redux';
import { useSearch } from '../hooks/useSearch';

export default function WorkoutForm(){
  const dispatch = useDispatch();
  const { createWorkout } = useCreateWorkout();
  const { createWorkoutError } = useSelector(state => state.workout);
  const title = React.useRef();
  const muscle_group = React.useRef();
  const load = React.useRef();
  const reps = React.useRef();

  const [emptyFields, setEmptyFields] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workout = {
      title: title.current.value,
      muscle_group: muscle_group.current.value,
      load: load.current.value,
      reps: reps.current.value,
    };
    if (!workout.title) {
      setEmptyFields((prev) => ["title", ...prev]);
    }
    if (!workout.muscle_group) {
      setEmptyFields((prev) => ["muscle group", ...prev]);
    }
    if (!workout.reps) {
      setEmptyFields((prev) => ["reps", ...prev]);
    }
    if (!workout.load) {
      setEmptyFields((prev) => ["load", ...prev]);
    } 
    if(workout.title && workout.muscle_group && workout.reps && workout.load){
     await createWorkout(workout);
     setEmptyFields([]);
    }   
  };

  return (
    <div className="form--container--workout--form">
    <form className="workout--form" aria-label="workout form" onSubmit={handleSubmit}>
      <button
        aria-label="close form"
        className="close material-symbols-outlined"
        onClick={() => dispatch({type: "SHOW_CREATE_WORKOUT_FORM"})}
      >       
        close
      </button>
      <h4>New workout</h4>
      <label>exercise title:</label>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="ex: bench press"
        aria-label="workout title"
        ref={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label htmlFor="muscle_group">muscle group:</label>
      <select ref={muscle_group} aria-label="muscle group" name="muscle_group" id="muscle_group" className={emptyFields.includes("muscle group") ? "error" : ""}>
        <option value="">-please select-</option>
        <option value="chest">chest</option>
        <option value="shoulder">shoulder</option>
        <option value="biceps">biceps</option>
        <option value="triceps">triceps</option>
        <option value="leg">leg</option>
        <option value="back">back</option>
        <option value="glute">glute</option>
        <option value="ab">ab</option>
        <option value="calf">calf</option>
        <option value="forearm and grip">forearm and grip</option>
      </select>
      <label>number of reps:</label>
      <input
        type="number"
        name="reps"
        id="reps"
        aria-label="number of reps"
        ref={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <label>load (kg):</label>
      <input
        type="number"
        name="load"
        id="load"
        aria-label="load in kg"
        ref={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />
        <button className="workout--form--btn" aria-label="submit workout button">Add workout</button>
      {createWorkoutError && (
        <div role="alert" className="error">
          {createWorkoutError}
        </div>
      )}
    </form>
    </div>
  );
}
