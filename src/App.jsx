// App.jsx
import React, { useState, useEffect } from "react";

import Login from "./components/Login";
import OtpVerification from "./components/OtpVerification";
import Layout from "./components/Pages/Layout";
import { ToastProvider } from "./components/Common/Toast";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState(null);

  // ✅ active page state for sidebar navigation
  const [activePage, setActivePage] = useState("dashboard-page");

  useEffect(() => {
    const savedUser = localStorage.getItem("uniERPUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // called when the Login component reports a successful sign‑in (or auto‑registration)
  // it saves the active session under `uniERPUser` so the app can auto‑restore on reload.
  // the Login component itself is responsible for a separate "remember me" value
  // which will pre‑fill the form even after an explicit logout.
  const handleLogin = (userOrName) => {
    let username = typeof userOrName === "string" ? userOrName : userOrName?.username;
    let role = typeof userOrName === "object" && userOrName?.role ? userOrName.role : "student";
    let email = typeof userOrName === "object" && userOrName?.email ? userOrName.email : null;

    if (!username) return;

    // If no email provided, generate a default institutional email from username
    if (!email) email = `${username}@kluniversity.in`;

    const userData = {
      username,
      role,
      email,
      avatar: username.substring(0, 2).toUpperCase(),
    };

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("uniERPUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("uniERPUser");
    // do not touch rememberedUser here; if the user chose "remember me" we keep the
    // info so the login form can pre‑populate next time. They can always uncheck the box.
  };

  return (
    <ToastProvider>
      <div className="App">
        {!isLoggedIn ? (
          verificationEmail ? (
            <div className="login-screen">
              <div className="login-right-panel" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <OtpVerification 
                  email={verificationEmail} 
                  onVerified={() => {
                    setVerificationEmail(null);
                    // maybe show a success toast here
                  }} 
                  onCancel={() => setVerificationEmail(null)}
                />
              </div>
            </div>
          ) : (
            <Login 
              onLogin={handleLogin} 
              onVerifyRequired={(email) => setVerificationEmail(email)}
            />
          )
        ) : (
          <Layout
            user={user}
            onLogout={handleLogout}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
