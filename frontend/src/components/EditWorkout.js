import React from 'react';
import useEditWorkout from '../hooks/useEditWorkout';


export default function EditWorkout(props){
  const {editWorkout, error} = useEditWorkout();
  const [title, setTitle] = React.useState(props.title);
  const [reps, setReps] = React.useState(props.reps);
  const [load, setLoad] = React.useState(props.load);
  const [emptyFields, setEmptyFields] = React.useState([]);

 const closeEditForm = () => props.showEdit();
 const handleUpdate = async (e) => {    
   e.preventDefault();
     if (!title){
      setEmptyFields(prev => ['title', ...prev])
    }
    if (!reps){
      setEmptyFields(prev => ['reps', ...prev])
    }
    if (load === (undefined || null)) {
      setEmptyFields((prev) => ["load", ...prev]);
    }
   await editWorkout(
     props.id,
     {
       title: title.trim().toLowerCase(),
       reps: reps,
       load: load,
     },
     closeEditForm
   ); 
 }
    return (
      <div className="form--container--edit--workout--form">
        <form
          className="edit--form"
          aria-label={`edit ${props.title} ${
            props.updatedAt
              ? `updated ${props.updatedAt}`
              : `created ${props.createdAt}`
          }`}
        >
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
            aria-label="workout title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes("title") ? "error" : ""}
          />
          <label>number of reps:</label>
          <input
            type="number"
            name="reps"
            id="reps"
            aria-label="number of reps"
            onChange={(e) => setReps(e.target.value)}
            value={reps}
            className={emptyFields.includes("reps") ? "error" : ""}
          />
          <label>load (kg):</label>
          <input
            type="number"
            name="load"
            id="load"
            aria-label="load in kg"
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