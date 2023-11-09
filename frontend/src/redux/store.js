import { legacy_createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import logger from "redux-logger";

function createStore() {
  if (process.env.NODE_ENV !== "development") {
    return legacy_createStore(rootReducer);
  }
  return legacy_createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(logger))
  );
}

const store = createStore();

export default store;
