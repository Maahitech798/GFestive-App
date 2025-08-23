import React, { useState } from "react";
import { register, login, isAuthenticated } from "../utils/auth";

export default function Auth({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (isLogin) {
      if (login(username, password)) {
        setAuth(true);
      } else {
        setMessage("Wrong credentials");
      }
    } else {
      if (register(username, password)) {
        setMessage("Registered successfully. Please login.");
        setIsLogin(true);
      } else {
        setMessage("Username already exists");
      }
    }
  };

  return (
    <div className="centered-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
    </div>
  );
}
