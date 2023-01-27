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
    
    return (
        <>
        <div className="workout-details">
            <h4>{title}</h4>
            <p>reps: {reps}</p>
            <p>load: {load}</p>
            <p className='date'>{formatDistanceToNow(new Date(createdAt), { addSuffix: true})}</p>
            <span className='material-symbols-outlined' onClick={handleDelete}>delete</span>
            <span className='material-symbols-outlined edit' onClick={showEdit}>edit</span>
            {error && <div className="error">{error}</div>} 
        </div>
        {showEditForm && <EditWorkout
                        key={id +'edit'}
                        id = {id}
                        title={title}
                        reps={reps}
                        load={load}
                        createdAt={createdAt}
                        showEdit={()=>showEdit()}
                         />}
        </>
    )
}