import formatDistanceToNow from "date-fns/formatDistanceToNow";
import useDeleteWorkout from "../hooks/useDeleteWorkout";
import { useDispatch } from "react-redux";

export default function WorkoutDetails({
  id,
  title,
  muscle_group,
  reps,
  load,
  createdAt,
  updatedAt,
}) {
  const dispatch = useDispatch();
  const { deleteWorkout } = useDeleteWorkout();
  const date = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  return (
    <>
      <div
        aria-label={`details of workout ${title} created ${date}`}
        className="workout-details"
      >
        <h4>{title}</h4>
        <p>
          <strong>reps:</strong> {reps}
        </p>
        <p>
          <strong>load:</strong> {load}
        </p>
        <p aria-label="date" className="date">
          {date}
        </p>
        <button
          aria-label={`delete workout ${title} created ${date}`}
          className="material-symbols-outlined"
          onClick={() => deleteWorkout(id)}
        >
          delete
        </button>
        <button
          aria-label={`open ${title} edit form created ${date}`}
          className="material-symbols-outlined edit"
          onClick={() =>
            dispatch({
              type: "TOGGLE_MOUNT_EDIT_WORKOUT_FORM",
              payload: {
                id,
                prevTitle: title,
                prevMuscleGroup: muscle_group,
                prevReps: reps,
                prevLoad: load,
                createdAt,
                updatedAt,
              },
            })
          }
        >
          edit
        </button>
      </div>
    </>
  );
}
