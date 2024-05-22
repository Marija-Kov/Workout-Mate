import { useEffect, lazy, Suspense, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearch } from "../hooks/useSearch";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutDetails from "../components/WorkoutDetails";
import Pagination from "../components/Pagination";
import Search from "../components/Search";
import Chart from "../components/Chart";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import { WorkoutsPlaceholder } from "../components/WorkoutsPlaceholder";
const EditWorkout = lazy(() => import("../components/EditWorkout"));
const MemoSearch = memo(Search);
const MemoWorkoutDetails = memo(WorkoutDetails);
const MemoChart = memo(Chart);
const MemoPagination = memo(Pagination);

export default function Home() {
  const dispatch = useDispatch();
  const { isCreateWorkoutFormMounted, isEditWorkoutFormMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const workouts = useSelector((state) => state.workouts);
  const loading = useSelector((state) => state.loader);
  const { allUserWorkoutsMuscleGroups, noWorkoutsByQuery } = workouts;
  const page = useSelector((state) => state.page);
  const query = useSelector((state) => state.query);
  const { total, workoutsChunk } = workouts;
  const { search } = useSearch();
  /**
   * This variable is the ultimate indicator for any workouts existing in the DB.
   */
  const muscleGroups =
    allUserWorkoutsMuscleGroups && allUserWorkoutsMuscleGroups.length;

  useEffect(() => {
    const runSearch = setTimeout(async () => {
      await search(query, page);
    }, 300);
    return () => clearTimeout(runSearch);
  }, [query, page]);

  const renderWorkouts = () => {
    return workoutsChunk.map((workout) => (
      <MemoWorkoutDetails
        key={workout._id}
        id={workout._id}
        title={workout.title}
        muscle_group={workout.muscle_group}
        reps={workout.reps}
        load={workout.load}
        createdAt={workout.createdAt}
        updatedAt={workout.updatedAt}
      />
    ));
  };

  const renderPlaceholderOrNoWorkoutsMessage = () => {
    if (loading) {
      return <WorkoutsPlaceholder />;
    }
    if (muscleGroups) {
      if (noWorkoutsByQuery) {
        return <div className="no--workouts--found">{noWorkoutsByQuery}</div>;
      }
      return <WorkoutsPlaceholder />;
    }
  };

  const buffItUpButtonClass = () => {
    if (loading && !muscleGroups) {
      return "no--button";
    }
    if (loading && muscleGroups) {
      return "add--workout is--loading";
    }
    if (!loading && muscleGroups) {
      return "add--workout";
    }
    if (!loading && !muscleGroups) {
      return "add--workout no--workouts--yet";
    }
  };

  return (
    <div className="home--container">
      <div className="home">
        {muscleGroups ? <MemoSearch /> : ""}

        <div aria-label="workouts" className="workouts--container">
          {total && muscleGroups
            ? renderWorkouts()
            : renderPlaceholderOrNoWorkoutsMessage()}
        </div>

        {muscleGroups ? <MemoChart /> : loading ? <ChartPlaceholder /> : ""}

        {isCreateWorkoutFormMounted ? (
          <WorkoutForm />
        ) : (
          <button
            className={buffItUpButtonClass()}
            onClick={() =>
              dispatch({ type: "TOGGLE_MOUNT_CREATE_WORKOUT_FORM" })
            }
            disabled={loading}
          >
            Buff It Up
          </button>
        )}

        {isEditWorkoutFormMounted && (
          <Suspense>
            <EditWorkout />
          </Suspense>
        )}

        {total ? <MemoPagination /> : ""}

        <div className="space"></div>
      </div>
    </div>
  );
}
