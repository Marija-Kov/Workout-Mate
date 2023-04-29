import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import useDeleteWorkout from '../hooks/useDeleteWorkout';

const EditWorkout = React.lazy(() => import("../components/EditWorkout"));

export default function WorkoutDetails({id, title, reps, load, createdAt, updatedAt, page, getItems, total, limit, spreadPages}){
    const [showEditForm, setShowEditForm] = React.useState(false);
    const {deleteWorkout, error} = useDeleteWorkout();

    const handleDelete = async () => {
      await deleteWorkout(id)
      await getItems('', page)
      spreadPages(total, limit)
    }

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
            onClick={handleDelete}
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
          {error && (
            <div role="alert" className="error">
              {error}
            </div>
          )}
        </div>
        {showEditForm && (
        <React.Suspense>
          <EditWorkout
            key={id + "edit"}
            id={id}
            title={title}
            reps={reps}
            load={load}
            createdAt={createdAt}
            updatedAt={updatedAt}
            showEdit={() => showEdit()}
          />
        </React.Suspense>  
        )}
      </>
    );
}