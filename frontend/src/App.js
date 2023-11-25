import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import { useGetUrl } from "./hooks/useGetUrl";

const Home = React.lazy(() => import("./pages/Home"));
const Signup = React.lazy(() => import("./pages/Signup"));
const About = React.lazy(() => import("./pages/About"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const ConfirmedAccount = React.lazy(() => import("./pages/ConfirmedAccount"));

function App() {
  const { user } = useSelector((state) => state.user);
  const { isSpunDownServerAlertMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const dispatch = useDispatch();
  const { getUrl } = useGetUrl();

  React.useEffect(() => {
    const url = getUrl();
    if (!url.includes(process.env.REACT_APP_WEB_SERVICE)) {
      return;
    }
    if (!localStorage.getItem("alerted")) {
      dispatch({ type: "TOGGLE_MOUNT_SPUN_DOWN_SERVER_ALERT" });
    }
    return;
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          {isSpunDownServerAlertMounted && (
            <div className="spun--down--server--alert">
              <p>
                NOTE: This app uses a free web service that spins the server
                down after a period of inactivity. If you haven't been here in a
                while, your initial request may take a minute. Thank you for
                your patience!
              </p>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "alerted",
                    "The user has been alerted about web service limitations"
                  );
                  dispatch({ type: "RESET_COMPONENTS_STATE" });
                }}
              >
                Got it, close this
              </button>
            </div>
          )}
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/" /> : <Signup />}
            />
            <Route
              path="/about"
              element={user ? <Navigate to="/" /> : <About />}
            />
            <Route
              path="/"
              element={!user ? <Navigate to="/login" /> : <Home />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/:accountConfirmationToken"
              element={<ConfirmedAccount />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
