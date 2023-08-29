import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import useDeleteWorkout from '../hooks/useDeleteWorkout';

const EditWorkout = React.lazy(() => import("../components/EditWorkout"));

export default function WorkoutDetails({id, title, muscle_group, reps, load, createdAt, updatedAt }){
    const [showEditForm, setShowEditForm] = React.useState(false);
    const { deleteWorkout } = useDeleteWorkout();

    const showEdit = () => {
       setShowEditForm(prev => !prev)
    }

    const date = formatDistanceToNow(new Date(createdAt), { addSuffix: true});

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
            onClick={showEdit}
          >
            edit
          </button>
        </div>
        {showEditForm && (
        <React.Suspense>
          <EditWorkout
            key={id + "edit"}
            id={id}
            title={title}
            muscle_group={muscle_group}
            reps={reps}
            load={load}
            createdAt={createdAt}
            updatedAt={updatedAt}
            showEdit={showEdit}
          />
        </React.Suspense>  
        )}
      </>
    );
}