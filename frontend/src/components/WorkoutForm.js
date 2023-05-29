import React from 'react';
import { useCreateWorkout } from '../hooks/useCreateWorkout';

export default function WorkoutForm({hideForm, spreadPages, flipPage, total, limit, getItems}){
  const { createWorkout, error } = useCreateWorkout();
  const title = React.useRef();
  const load = React.useRef();
  const reps = React.useRef();

  const [emptyFields, setEmptyFields] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workout = {
      title: title.current.value,
      load: load.current.value,
      reps: reps.current.value,
    };
    await createWorkout(workout);
    if (!workout.title) {
      setEmptyFields((prev) => ["title", ...prev]);
    }
    if (!workout.reps) {
      setEmptyFields((prev) => ["reps", ...prev]);
    }
    if (!workout.load) {
      setEmptyFields((prev) => ["load", ...prev]);
    }

    if(workout.title && workout.reps && workout.load){
     hideForm();
     await getItems("", 0);
     spreadPages(total, limit);
     flipPage(1)
     setEmptyFields([]);
    }   
  };

  return (
    <div className="form--container--workout--form">
    <form className="workout--form" aria-label="workout form" onSubmit={handleSubmit}>
      <button
        aria-label="close form"
        className="close material-symbols-outlined"
        onClick={hideForm}
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
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
    </form>
    </div>
  );
}
