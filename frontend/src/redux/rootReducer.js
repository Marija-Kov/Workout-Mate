import { combineReducers } from 'redux'
import { userReducer } from './user/userReducer'
import { workoutReducer } from './workout/workoutReducer'
import { pageReducer } from './page/pageReducer'
import { queryReducer } from './query/queryReducer'

const rootReducer = combineReducers({
 user: userReducer,
 workout: workoutReducer,
 page: pageReducer,
 query: queryReducer
})

export default rootReducer;