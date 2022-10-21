import React from 'react';
import { useAuthContext } from './useAuthContext';

// this should be like signup, but has to throw error when 
// the entered username does not exist in the database

export const useLogin = () => {
 const [error, setError] = React.useState(null);
 const [isLoading, setIsLoading] = React.useState(null); 
 const { dispatch } = useAuthContext();

 const login = async (username, password) => {
    setIsLoading(true);
    setError(null); 
     const response = await fetch('api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        })
        const json = await response.json();

        if (!response.ok){
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type:'LOGIN', payload:json});
            setIsLoading(false)
            setError(null);
        }


 }

    return { login, isLoading, error}
}