import React from 'react';
import useEditWorkout from '../hooks/useEditWorkout';


export default function EditWorkout(props){
  const {editWorkout, error} = useEditWorkout();
  const title = React.useRef();
  const muscle_group = React.useRef();
  const reps = React.useRef();
  const load = React.useRef();

 const closeEditForm = () => props.showEdit();
 const handleUpdate = async (e) => {  
   const payload = {};
   if (title.current.value && title.current.value.trim().toLowerCase()) {
     payload.title = title.current.value.trim().toLowerCase();
   }  
   if(muscle_group.current.value){
    payload.muscle_group = muscle_group.current.value;
   }
   if(reps.current.value){
    payload.reps = reps.current.value;
   }
   if(load.current.value){
    payload.load = load.current.value;
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
          <label htmlFor="muscle_group">muscle group:</label>
          <select ref={muscle_group} aria-label="muscle group" name="muscle_group" id="muscle_group">
              <option value="">{props.muscle_group}</option>
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