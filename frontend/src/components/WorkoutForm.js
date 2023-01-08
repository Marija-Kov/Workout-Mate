import React from 'react';
import { useCreateWorkout } from '../hooks/useCreateWorkout';

export default function WorkoutForm(props){
  const { createWorkout, error } = useCreateWorkout();
  const [workout, setWorkout] = React.useState({
    title: "",
    load: "",
    reps: "",
  });
  const [emptyFields, setEmptyFields] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
 
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
     props.hideForm();
     props.goToPageOne();
     setEmptyFields([]);
     setWorkout({ title: "", load: "", reps: "" });
    }   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
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
        onChange={handleChange}
        value={workout.title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>number of reps:</label>
      <input
        type="number"
        name="reps"
        id="reps"
        onChange={handleChange}
        value={workout.reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <label>load (kg):</label>
      <input
        type="number"
        name="load"
        id="load"
        onChange={handleChange}
        value={workout.load}
        className={emptyFields.includes("load") ? "error" : ""}
      />
      <p className="checky">
        <input type="checkbox" />
        <label>I am not making this up</label>
      </p>
      <div className="btns">
        <button>Add workout</button>
        <button className="discard" onClick={() => props.hideForm()}>
          Not now
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
