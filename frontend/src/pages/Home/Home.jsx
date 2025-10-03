import { useEffect, lazy, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearch } from "../../hooks";
import {
  WorkoutForm,
  Pagination,
  Search,
  Chart,
  Workouts,
} from "../../components";
const EditWorkout = lazy(() =>
  import("../../components").then((module) => ({ default: module.EditWorkout }))
);

const Home = () => {
  const dispatch = useDispatch();
  const { isCreateWorkoutFormMounted, isEditWorkoutFormMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const workouts = useSelector((state) => state.workouts);
  const loading = useSelector((state) => state.loader);
  const { allUserWorkoutsMuscleGroups } = workouts;
  const page = useSelector((state) => state.page);
  const query = useSelector((state) => state.query);
  const { search } = useSearch();
  const searchInputRef = useRef();
  /**
   * This variable is the ultimate indicator for any workouts existing in the DB.
   */
  const muscleGroups =
    allUserWorkoutsMuscleGroups && allUserWorkoutsMuscleGroups.length;

  useEffect(() => {
    if (
      searchInputRef.current &&
      searchInputRef.current.className === "focused"
    ) {
      const runSearchDebounce = setTimeout(async () => {
        await search(query, page);
      }, 500);
      return () => clearTimeout(runSearchDebounce);
    } else {
      search(query, page);
    }
  }, [query, page, search]);

  useEffect(() => {
    dispatch({ type: "SET_CHART_LOADER" });
  }, [dispatch]);

  const buffItUpButtonClass = () => {
    if (muscleGroups) return "add--workout";
    if (loading.workouts) {
      return "no--button";
    } else {
      return "add--workout no--workouts--yet";
    }
  };

  return (
    <div className="home--container">
      <div className="home">
        {muscleGroups ? <Search ref={searchInputRef} /> : ""}

        <Workouts />

        <Chart />

        {isCreateWorkoutFormMounted && <WorkoutForm />}

        <button
          className={buffItUpButtonClass()}
          onClick={() => dispatch({ type: "TOGGLE_MOUNT_CREATE_WORKOUT_FORM" })}
          disabled={loading.workouts}
        >
          Buff It Up
        </button>

        {isEditWorkoutFormMounted && (
          <Suspense>
            <EditWorkout />
          </Suspense>
        )}

        <Pagination />

        <div className="space"></div>
      </div>
    </div>
  );
};

export default Home;
