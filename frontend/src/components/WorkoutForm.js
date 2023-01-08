import React from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutContext';
import { useAuthContext } from '../hooks/useAuthContext';

export default function WorkoutForm(props){
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [workout, setWorkout] = React.useState({
    title: "",
    load: "",
    reps: "",
  });
  const [error, setError] = React.useState(null);
  const [emptyFields, setEmptyFields] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to do that");
      return;
    }
    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError("Please fill out the empty fields");
    }
    if (!workout.title) {
      setEmptyFields((prev) => ["title", ...prev]);
    }
    if (!workout.reps) {
      setEmptyFields((prev) => ["reps", ...prev]);
    }
    if (!workout.load) {
      setEmptyFields((prev) => ["load", ...prev]);
    }
    if (response.ok) {
      setWorkout({ title: "", load: "", reps: "" });
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
      props.hideForm();
      props.goToPageOne();
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
