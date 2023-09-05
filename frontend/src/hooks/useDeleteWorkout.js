import { useSelector, useDispatch } from "react-redux";

export default function useDeleteWorkout() {
       const dispatch = useDispatch();
       const { user } = useSelector(state => state.user);
       const { workouts } = useSelector(state => state.workout);
       const { workoutsChunk, allUserWorkoutsMuscleGroups, page } = workouts;
    const deleteWorkout = async (id) => {
        if (!user) {
         dispatch({type: "DELETE_ONE_FAIL", payload: "Not authorized"});
         return
        }
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/workouts/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const json = await response.json();
        
        if(response.ok){
          if(workoutsChunk.length===1 && page > 0) dispatch({type: "PREV_PAGE"})
          dispatch({ type: "DELETE_ONE_SUCCESS", payload: json.workout}); 
          dispatch({type: "SET_ROUTINE_BALANCE", payload: allUserWorkoutsMuscleGroups})
        }
        if(!response.ok){
          dispatch({ type: "DELETE_ONE_FAIL", payload: json.error});
        }
    }
  return { deleteWorkout }
}
