import { useEffect, lazy, Suspense } from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import Pagination from '../components/Pagination';
import { useSearch } from '../hooks/useSearch';
import Search from '../components/Search';
import { logOutIfTokenExpired } from '../utils/logOutIfTokenExpired';
import { Chart } from '../components/Chart';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { WorkoutsPlaceholder } from '../components/WorkoutsPlaceholder';
import { useDispatch, useSelector } from 'react-redux';
const EditWorkout = lazy(() => import("../components/EditWorkout"));

export default function Home() {
    const dispatch = useDispatch();
    const { showCreateWorkoutForm, showEditWorkoutForm } = useSelector(state => state.showComponent)
    const { workouts, loading, setWorkoutsError } = useSelector(state => state.workout);
    const { allUserWorkoutsMuscleGroups } = workouts;
    const page = useSelector(state => state.page);
    const query = useSelector(state => state.query);
    const { total, workoutsChunk } = workouts;
    const { search } = useSearch();

    useEffect(() => {
      search(query, page);
    }, [query, page]);

    const renderWorkouts = () => {
      return workoutsChunk.map((workout) => (
        <WorkoutDetails
          key={workout._id}
          id={workout._id}
          title={workout.title}
          muscle_group={workout.muscle_group}
          reps={workout.reps}
          load={workout.load}
          createdAt={workout.createdAt}
          updatedAt={workout.updatedAt}
        />
      ))
    };

    const renderNoWorkoutsMessage = () => {
      if(query){
        return <>No "{query}" workouts found.</>
      } else {
       return <>
               Buff it up to get started.
               <br></br>
               No pressure 
               <span>🥤</span>
              </> // TODO: This message shouldn't flash when query length decreases and hits 0, right before search function runs.
      }
    };
    
    const renderPlaceholderOrNoWorkoutsMessage = () => {
      if(loading){
       return <WorkoutsPlaceholder /> 
      } else {
       return <h4 className="get--started">
               {renderNoWorkoutsMessage()}
              </h4>
      }
    }
    const buffItUpButtonClass = () => {
      if(loading){
        return "add--workout is--loading"
      } else {
       if(total || query){
        return "add--workout"
       }
        return "add--workout no--workouts--yet"
      }
    };

    return (
      <div className="home--container" onClick={logOutIfTokenExpired}>
        <div className="home">
          <Search/>
            {setWorkoutsError && (
              <div role="alert" className="error">
                {setWorkoutsError}
              </div>
            )}

          <div aria-label="workouts" className="workouts--container">
            {total ? renderWorkouts() : renderPlaceholderOrNoWorkoutsMessage()}
          </div>
           
          {allUserWorkoutsMuscleGroups && allUserWorkoutsMuscleGroups.length ? <Chart /> : (
          loading ? <ChartPlaceholder /> : "")}
          
          {showCreateWorkoutForm ?
            <WorkoutForm /> :
            <button
              aria-label="buff it up"
              className={buffItUpButtonClass()}
              onClick={() => dispatch({type: "SHOW_CREATE_WORKOUT_FORM"})}
              disabled={loading}
            >
              + Buff It Up
            </button>
          }

          {showEditWorkoutForm && (
            <Suspense>
              <EditWorkout />
            </Suspense>  
          )}

          {total ? <Pagination /> : ""}

          <div className="space"></div>
          
        </div>
      </div>
    );
};
