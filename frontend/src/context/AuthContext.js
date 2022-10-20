import React from 'react';

export const AuthContext = React.createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
              user: action.payload
            };
        case 'LOGOUT':
            return {
             user: null
            };
        default:
            return state
    }

}

export const AuthContextProvider = (props) => {
    const [state, dispatch] = React.useReducer(authReducer, {
        user: null
    });
    console.log('AuthContext state: ', state);
    console.log(dispatch)
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}