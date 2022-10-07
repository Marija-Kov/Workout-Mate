import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useWorkoutsContext } from '../hooks/useWorkoutContext';

export default function WorkoutDetails(props){
    const {dispatch} = useWorkoutsContext();

    const handleClick = ()=>{
        fetch('/api/workouts/' + props.id, {
            method: 'DELETE'
        }).then(response => response.json())
        .then(json => dispatch({type: 'DELETE_ONE', payload: json }))
        .catch(err => console.log(err))
    }
    return (
        <div className="workout-details">
            <h4>{props.title}</h4>
            <p><strong>reps:</strong> {props.reps}</p>
            <p><strong>load:</strong> {props.load}</p>
            <p>{formatDistanceToNow(new Date(props.createdAt), { addSuffix: true})}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
        </div>
    )
}