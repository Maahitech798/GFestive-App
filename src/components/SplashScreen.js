import React, { useEffect, useState } from "react";
import "../CSS/SplashScreen.css"

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Hide splash after 3 seconds (adjust delay as needed)
    const timer = setTimeout(() => {
      onFinish();
    }, 20000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <img src="/splash.jpg" alt="Ganesh Festival" className="splash-image" />
      <h1 className="splash-text">Welcome to Ganesh Festival App</h1>
    </div>
  );
}
