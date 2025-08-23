import React, { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { isAuthenticated, logout } from "./utils/auth";
import ThemeSwitcher from "./components/ThemeSwitcher";


export default function App() {
  const [auth, setAuth] = useState(isAuthenticated());

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
