import { combineReducers } from 'redux'
import { userReducer } from './user/userReducer'
import { workoutReducer } from './workout/workoutReducer'

const rootReducer = combineReducers({
 user: userReducer,
 workout: workoutReducer,
})

export default rootReducer;