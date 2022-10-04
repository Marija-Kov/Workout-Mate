import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'

export default function Home() {
    const [workouts, setWorkouts] = React.useState(null); 
    React.useEffect(()=> {
        fetch('/api/workouts')
        .then(response => response.json())
        .then(data => setWorkouts(data))
        .catch(err => console.log(`ERROR: ${err}`))
    }, [])
   console.log(workouts)
    return(
        <div className='home'>
            <div className="workouts">
                {workouts &&  workouts.map(workout => (
                    <WorkoutDetails key={workout._id}
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

