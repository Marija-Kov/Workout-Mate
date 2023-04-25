import React from 'react'

export default function EditWorkout(props) {
      const [title, setTitle] = React.useState(props.title);
      const [reps, setReps] = React.useState(props.reps);
      const [load, setLoad] = React.useState(props.load);
      const [emptyFields, setEmptyFields] = React.useState([]);
      const [error, setError] = React.useState(null);
      
      const handleUpdate = () => {};

  return (
    <div className="form--container">
      <form className="edit--form" aria-label="edit workout form">
        <button
          aria-label="close form"
          className="close material-symbols-outlined"
          onClick={() => props.showEdit()}
        >
          close
        </button>
        <h4>Edit workout</h4>
        <label>exercise title:</label>
        <input
          type="text"
          name="title"
          id="title"
          aria-label="edit workout title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields.includes("title") ? "error" : ""}
        />
        <label>number of reps:</label>
        <input
          type="number"
          name="reps"
          id="reps"
          aria-label="edit number of reps"
          onChange={(e) => setReps(e.target.value)}
          value={reps}
          className={emptyFields.includes("reps") ? "error" : ""}
        />
        <label>load (kg):</label>
        <input
          type="number"
          name="load"
          id="load"
          aria-label="edit load in kg"
          onChange={(e) => setLoad(e.target.value)}
          value={load}
          className={emptyFields.includes("load") ? "error" : ""}
        />
        <button
          className="edit--form--btn"
          onClick={(e) => handleUpdate(e)}
          aria-label="submit edited workout button"
        >
          Save changes
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
