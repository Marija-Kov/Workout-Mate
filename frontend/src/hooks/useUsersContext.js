import React from 'react';
import { UsersContext } from '../context/UsersContext';

export const useUsersContext = () => {
    const context = React.useContext(UsersContext);
    
    if (!context){
        throw Error('useUsersContext must be used inside a UsersContextProvider')
    }
    return context
}