import { useState, useRef } from "react";
import { useCreateWorkout } from "../hooks/useCreateWorkout";
import { useDispatch } from "react-redux";

export default function WorkoutForm() {
  const dispatch = useDispatch();
  const { createWorkout } = useCreateWorkout();
  const title = useRef();
  const muscle_group = useRef();
  const load = useRef();
  const reps = useRef();
  const [badInput, setBadInput] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workout = {
      title: title.current.value,
      muscle_group: muscle_group.current.value,
      load: load.current.value,
      reps: reps.current.value,
    };
    setBadInput([]);
    if (
      !workout.title ||
      !workout.title.match(/^[a-zA-Z\s]*$/) ||
      workout.title.length > 30
    ) {
      setBadInput((prev) => ["title", ...prev]);
    }
    if (!workout.muscle_group) {
      setBadInput((prev) => ["muscle_group", ...prev]);
    }
    if (!workout.load || workout.load > 9999) {
      setBadInput((prev) => ["load", ...prev]);
    }
    if (!workout.reps || workout.reps > 9999) {
      setBadInput((prev) => ["reps", ...prev]);
    }
    await createWorkout(workout);
  };

  return (
    <div className="form--container--workout--form">
      <form className="workout--form" onSubmit={handleSubmit}>
        <button
          className="close material-symbols-outlined"
          onClick={() => {
            dispatch({ type: "TOGGLE_MOUNT_CREATE_WORKOUT_FORM" });
          }}
        >
          close
        </button>
        <h4>New workout</h4>
        <label htmlFor="title">exercise title:</label>
        <input
          type="text"
          name="title"
          id="title"
          data-testid="title"
          placeholder="ex: bench press"
          ref={title}
          className={badInput.includes("title") ? "error" : ""}
        />
        <label htmlFor="muscle_group">muscle group:</label>
        <select
          ref={muscle_group}
          name="muscle_group"
          id="muscle_group"
          data-testid="muscle_group"
          className={badInput.includes("muscle_group") ? "error" : ""}
        >
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
        <label htmlFor="reps">number of reps:</label>
        <input
          type="number"
          name="reps"
          id="reps"
          data-testid="reps"
          ref={reps}
          className={badInput.includes("reps") ? "error" : ""}
        />
        <label htmlFor="load">load (kg):</label>
        <input
          type="number"
          name="load"
          id="load"
          data-testid="load"
          ref={load}
          className={badInput.includes("load") ? "error" : ""}
        />
        <button className="workout--form--btn">Add workout</button>
      </form>
    </div>
  );
}
