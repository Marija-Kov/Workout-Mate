import React from 'react';

export const WorkoutsContext = React.createContext();

export const workoutsReducer = (state, action) => { // state === previous state
    switch (action.type){                           // action === {type:.., payload:..}
        case 'SET_WORKOUTS':                     // ⟡ state === {item: {type:.., payload:[..]}}
            return { 
                workouts: action.payload
            }; 
        case 'CREATE_WORKOUT':
            return {
                workouts: [action.payload, ...state.workouts]
            }; 
        // case 'GET_ONE':
        //     return {
        //         workouts: action.payload._id
        //     };
        // case 'UPDATE_ONE':
        //     return {
        //         workouts: [action.payload, ...state.workouts]
        //     }; 
        case 'DELETE_ONE':
            return {
                workouts: state.workouts.filter(e => e._id !== action.payload._id )
            };
        default:
            return state; // ⟡ all cases return the state object;       
    }   // ⟡ returning values are about keeping local state in sync with the database, not interacting with it;

} 

export const WorkoutsContextProvider  = (props) => {  
   const [state, dispatch] = React.useReducer(workoutsReducer, {
       workouts: null
   }) // ...state === state.workouts ; the state object can be conveniently destructured within the context provider object; 
   
    return (
        <WorkoutsContext.Provider value={{...state, dispatch}}> 
            { props.children } 
        </WorkoutsContext.Provider>
    )
}

// ⟡ props.children represents any component being wrapped/rendered within the context component.