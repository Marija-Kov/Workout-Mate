import { useDispatch } from 'react-redux';

export const useLogout = () => {
 const dispatch = useDispatch();

 const logout = () => {
     if(localStorage.getItem('user')){
      localStorage.removeItem('user');
     }
     if(localStorage.getItem('newImg')){
        localStorage.removeItem('newImg')
     }
     if (localStorage.getItem("username")) {
       localStorage.removeItem("username");
     }
     dispatch({type: 'LOGOUT'})
     dispatch({type: 'SET_WORKOUTS_SUCCESS', payload: {}});
     dispatch({type: "SET_ROUTINE_BALANCE", payload: []})
     dispatch({type: "HIDE_ALL_COMPONENTS"});
     dispatch({type: "GO_TO_PAGE_NUMBER", payload: 0});
     dispatch({type: "SET_QUERY", payload: ""});

    return "You have been logged out"
 }

 return { logout }
}