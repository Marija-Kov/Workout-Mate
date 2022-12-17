import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useWorkoutsContext } from '../hooks/useWorkoutContext';
import { useAuthContext } from '../hooks/useAuthContext';

const EditWorkout = React.lazy(() => import("../components/EditWorkout"));

export default function WorkoutDetails(props){
    const [showEditForm, setShowEditForm] = React.useState(false);
    const [error, setError] = React.useState(null);
    const {dispatch} = useWorkoutsContext();
    const { user } = useAuthContext();
    const handleClick = ()=>{
         if(!user){
          setError('You must be logged in to do that')
          return
          }
        fetch('/api/workouts/' + props.id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then(response => response.json())
        .then(json => dispatch({type: 'DELETE_ONE', payload: json }))
        .catch(err => console.log(err))
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