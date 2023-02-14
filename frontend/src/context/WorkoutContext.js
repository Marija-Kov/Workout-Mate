import React from 'react';

export const WorkoutContext = React.createContext();

export const workoutsReducer = (state, action) => { // state === previous state
    switch (action.type){                           // action === {type:.., payload:..}
        case 'SET_WORKOUTS':                        // ⟡ state === {item: {type:.., payload:[..]}}
            return { 
                workouts: action.payload
            }; 
        case 'CREATE_WORKOUT':
            return {
                workouts: [action.payload, ...state.workouts]
            }; 
        case 'UPDATE_ONE':
          state.workouts = state.workouts.filter(e => e._id !== action.payload._id );
            return {
                workouts: [action.payload, ...state.workouts]
            }
        case 'DELETE_ONE':
            return {
                workouts: state.workouts.filter(e => e._id !== action.payload._id )
            };
        case 'DELETE_ALL':
            return {
                workouts: []
            }
        default:
            return state;       
    }   

} 

export const WorkoutContextProvider  = (props) => {  
   const [state, dispatch] = React.useReducer(workoutsReducer, {
       workouts: null
   }) 
    return (
        <WorkoutContext.Provider value={{...state, dispatch}}> 
            { props.children } 
        </WorkoutContext.Provider>
    )
}
