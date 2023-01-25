import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import useDeleteWorkout from '../hooks/useDeleteWorkout';
import { useSearch } from '../hooks/useSearch';

const EditWorkout = React.lazy(() => import("../components/EditWorkout"));

export default function WorkoutDetails(props){
    const [showEditForm, setShowEditForm] = React.useState(false);
    const {deleteWorkout, error} = useDeleteWorkout();
    const {search} = useSearch();

    const handleClick = async () => {
      await deleteWorkout(props.id)
      await search('', props.page)
    }

    const showEdit = () => {
       setShowEditForm(prev => !prev)
    }
    
    return (
        <>
        <div className="workout-details">
            <h4>{props.title}</h4>
            <p>reps: {props.reps}</p>
            <p>load: {props.load}</p>
            <p className='date'>{formatDistanceToNow(new Date(props.createdAt), { addSuffix: true})}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
            <span className='material-symbols-outlined edit' onClick={showEdit}>edit</span>
            {error && <div className="error">{error}</div>} 
        </div>
        {showEditForm && <EditWorkout
                        key={props.id +'edit'}
                        id = {props.id}
                        title={props.title}
                        reps={props.reps}
                        load={props.load}
                        createdAt={props.createdAt}
                        showEdit={()=>showEdit()}
                         />}
        </>
    )
}