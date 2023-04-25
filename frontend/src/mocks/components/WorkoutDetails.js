import React from 'react'
import EditWorkout from "./EditWorkout"

export default function WorkoutDetails({
  id,
  title,
  reps,
  load,
  createdAt,
  updatedAt,
  page,
  getItems,
  total,
  limit,
  spreadPages,
}) {
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [error, setError] = React.useState(null)
  const handleDelete = () => {};
  const showEdit = () => {
    setShowEditForm(prev => !prev)
   };
  return (
    <>
      <div className="workout-details">
        <h4 aria-label="workout details title">{title}</h4>
        <p aria-label="workout details reps">{reps}</p>
        <p aria-label="workout details load">{load}</p>
        <p aria-label="date" className="date">{Date.now()}</p>
        <button
          aria-label="delete workout"
          className="material-symbols-outlined"
          onClick={handleDelete}
        >
          delete
        </button>
        <button
          aria-label="open edit workout form"
          className="material-symbols-outlined edit"
          onClick={showEdit}
        >
          edit
        </button>
        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}
      </div>
      {showEditForm && (
        <EditWorkout
          key={id + "edit"}
          id={id}
          title={title}
          reps={reps}
          load={load}
          createdAt={createdAt}
          showEdit={() => showEdit()}
        />
      )}
    </>
  );
}
