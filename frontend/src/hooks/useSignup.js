import React from 'react';

export const useSignup = () => {
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(null); 
    const [verificationNeeded, setVerificationNeeded] = React.useState(null);

    const signup = async (credentials) => {
        setIsLoading(true);
        setError(null);
        const response = await fetch('api/users/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        })
        const json = await response.json();

        if (!response.ok){
            setIsLoading(false);
            setError(json.error);
            setVerificationNeeded(false);
        }
        if (response.ok) {
            setIsLoading(false)
            setError(null);
            setVerificationNeeded(true);
        }
    }

   return { signup, isLoading, error, verificationNeeded } 
}





