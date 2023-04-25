import React from 'react'

export default function WorkoutForm({
  hideForm,
  spreadPages,
  flipPage,
  total,
  limit,
  getItems,
}) {
    const [emptyFields, setEmptyFields] = React.useState([]);
    const [workout, setWorkout] = React.useState({
      title: "",
      load: "",
      reps: "",
    });
    const [error, setError] = React.useState(null)
      const handleSubmit = () => {};
      const handleChange = () => {};

  return (
    <div className="form--container">
      <form
        className="workout--form"
        aria-label="workout form"
        onSubmit={handleSubmit}
      >
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
        <button
          className="workout--form--btn"
          aria-label="submit workout button"
        >
          Add workout
        </button>
        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
