import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Cookies from 'js-cookie';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
export const server =  "http://localhost:4000/api/v1";
export const Context = createContext({ isAuthenticated: false });

// app wrapper
const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  // checking for token in cookies
  useEffect(() => {
    // Check for authentication token in cookies on app load
    const token = Cookies.get("tokenf");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        isAuthenticated ,
        setIsAuthenticated,
        loading,
        setLoading,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
