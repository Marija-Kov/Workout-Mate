import { memo } from "react";
import { useSelector } from "react-redux";
import { WorkoutDetails, WorkoutsPlaceholder } from "../";

const Workouts = () => {
  const loading = useSelector((state) => state.loader);
  const workouts = useSelector((state) => state.workouts);
  const { foundCount, chunk, allMuscleGroups, noWorkoutsByQuery } = workouts;

  const showContent = () => {
    if (loading.workouts) {
      return <WorkoutsPlaceholder />;
    }
    if (!(allMuscleGroups && allMuscleGroups.length)) return "";
    if (foundCount) {
      return chunk.map((workout) => (
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
      ));
    } else {
      return (
        <div data-testid="no-workouts" className="no--workouts--found">
          {noWorkoutsByQuery}
        </div>
      );
    }
  };
  return (
    <div aria-label="workouts" className="workouts--container">
      {showContent()}
    </div>
  );
};

export default memo(Workouts);
