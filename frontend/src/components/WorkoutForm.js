import React from 'react';
import { useCreateWorkout } from '../hooks/useCreateWorkout';

export default function WorkoutForm({hideForm, spreadPages, flipPage, total, limit, getItems}){
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
     hideForm();
     await getItems("", 0);
     spreadPages(total, limit);
     flipPage(1)
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
    <div className="form--container">
    <form className="workout--form" onSubmit={handleSubmit}>
      <button
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
        onChange={handleChange}
        value={workout.title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>number of reps:</label>
      <input
        type="number"
        name="reps"
        id="reps"
        aria-label="number of reps"
        onChange={handleChange}
        value={workout.reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <label>load (kg):</label>
      <input
        type="number"
        name="load"
        id="load"
        aria-label="load in kg"
        onChange={handleChange}
        value={workout.load}
        className={emptyFields.includes("load") ? "error" : ""}
      />
        <button className="workout--form--btn">Add workout</button>
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
    </form>
    </div>
  );
}
