import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import EditWorkout from '../components/EditWorkout'
import { useWorkoutsContext } from '../hooks/useWorkoutContext';

export default function WorkoutDetails(props){
    const [showEditForm, setShowEditForm] = React.useState(false);
    const {dispatch} = useWorkoutsContext();
   console.log(`details ${props.id} rendered`)
    const handleClick = ()=>{
        fetch('/api/workouts/' + props.id, {
            method: 'DELETE'
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