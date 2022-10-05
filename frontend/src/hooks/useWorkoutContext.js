import React from 'react';
import { WorkoutsContext} from '../context/WorkoutContext';

export const useWorkoutsContext = () => {
    const context = React.useContext(WorkoutsContext);
    
    if (!context){
        throw Error('useWorkoutsContext must be used inside an WorkoutContextProvider')
    }
    return context
}