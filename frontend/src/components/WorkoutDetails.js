import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default function WorkoutDetails(props){

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