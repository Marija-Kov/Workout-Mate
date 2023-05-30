import React from 'react';
import useEditWorkout from '../hooks/useEditWorkout';


export default function EditWorkout(props){
  const {editWorkout, error} = useEditWorkout();
  const title = React.useRef();
  const reps = React.useRef();
  const load = React.useRef();

 const closeEditForm = () => props.showEdit();
 const handleUpdate = async (e) => {  
   const payload = {};
   if (title.current.value && title.current.value.trim().toLowerCase()) {
     payload.title = title.current.value.trim().toLowerCase();
   }  
   if(reps.current.value){
    payload.reps = reps.current.value;
   }
   if(load.current.value){
    payload.load = reps.current.value;
   }
   e.preventDefault();
   await editWorkout(props.id, payload, closeEditForm); 
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
            defaultValue={props.title}
            ref={title}
          />
          <label>number of reps:</label>
          <input
            type="number"
            name="reps"
            id="reps"
            aria-label="number of reps"
            defaultValue={props.reps}
            ref={reps}
          />
          <label>load (kg):</label>
          <input
            type="number"
            name="load"
            id="load"
            aria-label="load in kg"
            defaultValue={props.load}
            ref={load}
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