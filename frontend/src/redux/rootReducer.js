import { combineReducers } from "redux";
import { userReducer } from "./user/userReducer";
import { workoutReducer } from "./workout/workoutReducer";
import { pageReducer } from "./page/pageReducer";
import { queryReducer } from "./query/queryReducer";
import { showComponentReducer } from "./showComponent/showComponentReducer";
import { routineBalanceReducer } from "./routineBalance/routineBalanceReducer";

const rootReducer = combineReducers({
  user: userReducer,
  workout: workoutReducer,
  page: pageReducer,
  query: queryReducer,
  showComponent: showComponentReducer,
  routineBalance: routineBalanceReducer,
});

export default rootReducer;
