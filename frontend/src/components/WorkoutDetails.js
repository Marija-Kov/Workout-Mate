import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import useDeleteWorkout from '../hooks/useDeleteWorkout';
import { useSearch } from '../hooks/useSearch';

const EditWorkout = React.lazy(() => import("../components/EditWorkout"));

export default function WorkoutDetails({id, title, reps, load, createdAt, updatedAt, page}){
    const [showEditForm, setShowEditForm] = React.useState(false);
    const {deleteWorkout, error} = useDeleteWorkout();
    const {search, total, limit} = useSearch();

    const handleClick = async () => {
      await deleteWorkout(id)
      await search('', page)
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
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
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