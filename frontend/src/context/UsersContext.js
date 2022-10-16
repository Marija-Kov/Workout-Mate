import React from 'react';

export const UsersContext = React.createContext();

export const usersReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_USER':
            return {
                users: [action.payload, ...state.users]
            };
        case 'GET_USER':
            return {
                users: action.payload._id
            }
        default:
            return state;
    }

}

export const UsersContextProvider = (props) => {
    const [state, dispatch] = React.useReducer(usersReducer, {
        users: []
    });
 console.log(state)
    return (
        <UsersContext.Provider value={{...state, dispatch}}>
            {props.children}
        </UsersContext.Provider>
    )
}