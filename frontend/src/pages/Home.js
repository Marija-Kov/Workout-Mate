import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'

export default function Home() {

    const { workouts, dispatch } = useWorkoutsContext(); // replacing local state
    React.useEffect(()=> {
        fetch('/api/workouts')
        .then(response => response.json())
        .then(data => {
             dispatch({type: 'SET_WORKOUTS', payload: data});       
        })
        .catch(err => console.log(`ERROR: ${err}`));
    }, []);
   
    return(
        <div className='home'>
            <div className="workouts">
                {workouts &&  workouts.map(workout => (
                    <WorkoutDetails 
                        key={workout._id}
                        id = {workout._id}
                        title={workout.title}
                        reps={workout.reps}
                        load={workout.load}
                        createdAt={workout.createdAt}
                        />
                  )
                )}
            </div>
            <WorkoutForm />
        </div>
    )
};

