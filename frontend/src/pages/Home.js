import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts, dispatch } = useWorkoutsContext(); // replacing local state
    React.useEffect(()=> {
        fetch('/api/workouts')
        .then(response => response.json())
        .then(data => {
             dispatch({type: 'SET_WORKOUTS', payload: data});       
        })
        .catch(err => console.log(`ERROR: ${err}`));
    }, []);
   function hideForm(){
       setAddWorkoutForm(false)
   }
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
            {addWorkoutForm && <WorkoutForm 
                                 hideForm={()=> hideForm()}/>}
           {!addWorkoutForm && <button className='add--workout' onClick={()=> setAddWorkoutForm(true)}>+ Add workout</button>}   
        </div>
    )
};

