import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./scss/index.scss";
import App from "./App/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <StrictMode>
      <Suspense
        fallback={
          <div className="fallback--animation--container">
            <h1>Please wait</h1>
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        }
      >
        <App />
      </Suspense>
    </StrictMode>
  </Provider>
);
