import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import Pagination from '../components/Pagination'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'
// import { useAuthContext } from '../hooks/useAuthContext';

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts } = useWorkoutsContext(); 
    console.log(workouts)
    // const { user } = useAuthContext();
    // React.useEffect(()=> {
    //     fetchAPI(user, dispatch)
    //     return ()=>{console.log('cleanup here')}  
    // }, [dispatch, user]);

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
            <Pagination />
            {addWorkoutForm && <WorkoutForm 
                                 hideForm={()=> hideForm()}/>}
           {!addWorkoutForm && <button className='add--workout' onClick={()=> setAddWorkoutForm(true)}>+ Add workout</button>}   
        </div>
    )
};

// function fetchAPI(user, dispatch) {
//    if (user) {
//      fetch("/api/workouts", {
//        headers: {
//          Authorization: `Bearer ${user.token}`,
//        },
//      })
//        .then((response) => response.json())
//        .then((data) => {
//          dispatch({ type: "SET_WORKOUTS", payload: data });
//          console.log(`HOME ${data.length}`)
//        })
//        .catch((err) => console.log(`ERROR: ${err}`));
//    }
// }

