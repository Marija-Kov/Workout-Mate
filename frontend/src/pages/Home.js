import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'

export default function Home() {
    // const [workouts, setWorkouts] = React.useState(null);  getting rid of the local state 
    const { workouts, dispatch } = useWorkoutsContext(); // introducing global state
    React.useEffect(()=> {
        fetch('/api/workouts')
        .then(response => response.json())
        .then(data => {
             dispatch({type: 'SET_WORKOUTS', payload: data});       
        })
        .catch(err => console.log(`ERROR: ${err}`));
    }, []);
    console.log(useWorkoutsContext())
    return(
        <div className='home'>
            <div className="workouts">
                {workouts &&  workouts.map(workout => (
                    <WorkoutDetails 
                        key={workout._id}
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

