import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from '../hooks/useAuthContext';

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts, dispatch } = useWorkoutsContext(); // replacing local state
    const { user } = useAuthContext();
   console.log('home page rendered')
    React.useEffect(()=> {
      if(user){
        fetch('/api/workouts', {
         headers: {
             'Authorization': `Bearer ${user.token}`
         }
        })
        .then(response => response.json())
        .then(data => {
             dispatch({type: 'SET_WORKOUTS', payload: data});            
        })
        .catch(err => console.log(`ERROR: ${err}`));  
       }
        return ()=>{console.log('cleanup here')}

    }, [dispatch, user]);

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
                        updatedAt={workout.updatedAt}
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

