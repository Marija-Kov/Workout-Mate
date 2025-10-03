import { useRef, useState } from "react";
import { useEditWorkout } from "../../hooks";
import { useSelector, useDispatch } from "react-redux";

const EditWorkout = () => {
  const dispatch = useDispatch();
  const { editWorkout } = useEditWorkout();
  const { prepopulateEditWorkoutForm } = useSelector(
    (state) => state.toggleMountComponents
  );
  const { id, prevTitle, prevMuscleGroup, prevReps, prevLoad } =
    prepopulateEditWorkoutForm;
  const title = useRef();
  const muscle_group = useRef();
  const reps = useRef();
  const load = useRef();
  const [badInput, setBadInput] = useState([]);

  const handleUpdate = async (e) => {
    const payload = {};
    setBadInput([]);
    if (title.current.value && title.current.value.trim().toLowerCase()) {
      payload.title = title.current.value.trim().toLowerCase();
      if (!payload.title.match(/^[a-zA-Z\s]*$/) || payload.title.length > 30) {
        setBadInput((prev) => ["title", ...prev]);
      }
    }
    if (muscle_group.current.value) {
      payload.muscle_group = muscle_group.current.value;
    }
    if (reps.current.value) {
      payload.reps = reps.current.value;
      if (payload.reps > 9999) {
        setBadInput((prev) => ["reps", ...prev]);
      }
    }
    if (load.current.value) {
      payload.load = load.current.value;
      if (payload.load > 9999) {
        setBadInput((prev) => ["load", ...prev]);
      }
    }
    e.preventDefault();
    await editWorkout(id, payload);
  };
  return (
    <div className="form--container--edit--workout--form">
      <form data-testid="edit" className="edit--form">
        <button
          className="close material-symbols-outlined"
          onClick={() => {
            dispatch({ type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM" });
            dispatch({ type: "RESET_WORKOUT_ERROR_MESSAGES" });
          }}
        >
          close
        </button>
        <h4>Edit workout</h4>
        <label htmlFor="title">exercise title:</label>
        <input
          type="text"
          name="title"
          id="title"
          data-testid="title"
          defaultValue={prevTitle}
          ref={title}
          className={badInput.includes("title") ? "error" : ""}
        />
        <label htmlFor="muscle_group">muscle group:</label>
        <select
          ref={muscle_group}
          name="muscle_group"
          id="muscle_group"
          data-testid="muscle_group"
        >
          <option value="">{prevMuscleGroup}</option>
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
          defaultValue={prevReps}
          ref={reps}
          className={badInput.includes("reps") ? "error" : ""}
        />
        <label htmlFor="load">load (kg):</label>
        <input
          type="number"
          name="load"
          id="load"
          data-testid="load"
          defaultValue={prevLoad}
          ref={load}
          className={badInput.includes("load") ? "error" : ""}
        />
        <button className="edit--form--btn" onClick={(e) => handleUpdate(e)}>
          Save changes
        </button>
      </form>
    </div>
  );
};

export default EditWorkout;
