import { useAuthContext } from './useAuthContext';
import { useWorkoutsContext } from './useWorkoutContext'; 

export const useLogout = () => {
 const { dispatch } = useAuthContext();
 const { dispatch: workoutsDispatch } = useWorkoutsContext();

 const logout = () => {
     localStorage.removeItem('user');
     dispatch({type: 'LOGOUT'})
     // clearing the global workouts state:
     workoutsDispatch({type: 'SET_WORKOUTS', payload: null})
 }

 return { logout }
}