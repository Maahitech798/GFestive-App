import React from "react";
import Gallery from "./Gallery";
import Countdown from "./Countdown";
import Wishes from "./Wishes";

export default function Dashboard() {
  return (
    <div className="centered-container">
      <h1>Ganesh Festival App</h1>
      <Countdown />
      <Gallery />
      <Wishes />
      {/* Add more features as needed */}
    </div>
  );
}
