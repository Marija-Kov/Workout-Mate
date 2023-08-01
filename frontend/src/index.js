import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/index.scss'
import App from './App';
import { WorkoutContextProvider } from './context/WorkoutContext'
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <React.Suspense
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
      <AuthContextProvider>
        <WorkoutContextProvider>
          <App />
        </WorkoutContextProvider>
      </AuthContextProvider>
    </React.Suspense>
  </React.StrictMode>
);

