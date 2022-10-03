import React from 'react';

export default function WorkoutDetails(props){

    return (
        <div className="workout-details">
            <h4>{props.title}</h4>
            <p><strong>reps:</strong> {props.reps}</p>
            <p><strong>load:</strong> {props.load}</p>
            <p>{props.createdAt}</p>
        </div>
    )
}