import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import Navbar from'../components/Navbar'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts } = useWorkoutsContext(); 
    const [page, setPage] = React.useState(0);

   function hideForm(){
       setAddWorkoutForm(false)
   }

   function goToPageOne(){
    setPage(0)
   }

    return (
      <>
        <Navbar page={page} setPage={setPage}/>
        <div className="home">
          <div className="workouts">
            {workouts &&
              workouts.map((workout) => (
                <WorkoutDetails
                  key={workout._id}
                  id={workout._id}
                  title={workout.title}
                  reps={workout.reps}
                  load={workout.load}
                  createdAt={workout.createdAt}
                  updatedAt={workout.updatedAt}
                />
              ))}
          </div>
          {addWorkoutForm && 
          <WorkoutForm 
          goToPageOne={() => goToPageOne()}
          hideForm={() => hideForm()} />}
          {!addWorkoutForm && (
            <button
              className="add--workout"
              onClick={() => setAddWorkoutForm(true)}
            >
              + Add workout
            </button>
          )}
        </div>
      </>
    );
};
