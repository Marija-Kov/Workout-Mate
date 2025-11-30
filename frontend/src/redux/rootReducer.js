import { combineReducers } from "redux";
import { userReducer } from "./user/userReducer";
import { workoutReducer } from "./workout/workoutReducer";
import { pageReducer } from "./page/pageReducer";
import { queryReducer } from "./query/queryReducer";
import { toggleMountComponentsReducer } from "./toggleMountComponents/toggleMountComponentsReducer";
import { routineBalanceReducer } from "./routineBalance/routineBalanceReducer";
import { flashMessagesReducer } from "./flashMessages/flashMessagesReducer";
import { loaderReducer } from "./loader/loaderReducer";

const rootReducer = combineReducers({
  user: userReducer,
  workouts: workoutReducer,
  page: pageReducer,
  query: queryReducer,
  toggleMountComponents: toggleMountComponentsReducer,
  routineBalance: routineBalanceReducer,
  flashMessages: flashMessagesReducer,
  loader: loaderReducer,
});

export default rootReducer;
