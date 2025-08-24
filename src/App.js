import React, { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { isAuthenticated, logout } from "./utils/auth";
import ThemeSwitcher from "./components/ThemeSwitcher";
import SplashScreen from "./components/SplashScreen";


export default function App() {
  const [auth, setAuth] = useState(isAuthenticated());
   const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div>
      <ThemeSwitcher />
      {!auth ? (
        <Auth setAuth={setAuth} />
      ) : (
        <div>
          <button className="logout-button" onClick={() => { logout(); setAuth(false); }}>Logout</button>
          <Dashboard />
        </div>
      )}
    </div>
  );
}
