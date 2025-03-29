import React, { memo } from "react";
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
const NotFound = React.lazy(() => import("./pages/NotFound"));
const MemoNavbar = memo(Navbar);

function App() {
  const user = useSelector((state) => state.user);
  const { isSpunDownServerAlertMounted, isCookieAlertMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const { success, error } = useSelector((state) => state.flashMessages);
  const dispatch = useDispatch();
  const url = useGetUrl();

  React.useEffect(() => {
    const service = process.env.REACT_APP_WEB_SERVICE || "localhost";
    if (!url.includes(service)) {
      return;
    }
    if (!localStorage.getItem("spunDownServerAlert")) {
      dispatch({ type: "TOGGLE_MOUNT_SPUN_DOWN_SERVER_ALERT" });
    }
    return;
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <MemoNavbar />
        <div className="pages">
          {isSpunDownServerAlertMounted && (
            <div className="spun--down--server--alert">
              <p>
                This app uses a free web service that spins down
                after a period of inactivity. If you haven't been here in a
                while, your initial request may take a minute. Thank you for
                your patience!
              </p>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "spunDownServerAlert",
                    "The user has been alerted about web service limitations"
                  );
                  dispatch({ type: "RESET_COMPONENTS_STATE" });
                  dispatch({ type: "TOGGLE_MOUNT_COOKIE_ALERT" });
                }}
              >
                Got it, close this
              </button>
            </div>
          )}
          {isCookieAlertMounted && (
            <div className="cookie--alert">
              <p>
                We use 1 cookie to keep you logged in for a while. That's all!
              </p>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "cookieAlert",
                    "The user has been alerted about cookie usage"
                  );
                  dispatch({ type: "RESET_COMPONENTS_STATE" });
                }}
              >
                Got it
              </button>
            </div>
          )}
          {error && (
            <div role="alert" className="error flashMessage">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div role="alert" className="success flashMessage">
              <p>{success}</p>
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
              path="/confirmaccount/*"
              element={<ConfirmedAccount />} 
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
