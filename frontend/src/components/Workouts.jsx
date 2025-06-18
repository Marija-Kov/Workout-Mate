import { memo } from 'react'
import { useSelector } from "react-redux";
import WorkoutDetails from "./WorkoutDetails";
import { WorkoutsPlaceholder } from './WorkoutsPlaceholder';

const Workouts = () => {
    const loading = useSelector((state) => state.loader);
    const workouts = useSelector((state) => state.workouts);
    const { total, workoutsChunk, allUserWorkoutsMuscleGroups, noWorkoutsByQuery } = workouts;

    const showContent = () => {
        if (loading.workouts) {
            return <WorkoutsPlaceholder />;
        }
        if (!(allUserWorkoutsMuscleGroups && allUserWorkoutsMuscleGroups.length)) return "";
        if (total) {
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
            ));
        } else {
            return <div data-testid="no-workouts" className="no--workouts--found">{noWorkoutsByQuery}</div>;
        }
    };
    return (
        <div aria-label="workouts" className="workouts--container">
            {showContent()}
        </div>
    )
}

export default memo(Workouts)
