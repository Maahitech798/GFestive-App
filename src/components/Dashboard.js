// import React from "react";
// import Gallery from "./Gallery";
// import Countdown from "./Countdown";
// import Wishes from "./Wishes";
// import ChandhaList from "./ChandhaList";

// export default function Dashboard() {
//   return (
//     <div className="centered-container">
//       <h1>Ganesh Festival App</h1>
//       <Countdown />
//       <Gallery />
//       <Wishes />
//       <ChandhaList />
//       {/* Add more features as needed */}
//     </div>
//   );
// }


import React, { useState } from "react";
import ChandhaList from "./ChandhaList";
import Gallery from "./Gallery";
import Wishes from "./Wishes";
import "../CSS/Dashboard.css"
// import Countdown from "./Countdown";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("chandha");

  const renderContent = () => {
    switch (activeTab) {
      case "chandha":
        return <ChandhaList />;
      case "gallery":
        return <Gallery />;
      case "wishes":
        return <Wishes />;
      // case "countdown":
      //   return <Countdown />;
      default:
        return <ChandhaList />;
    }
  };

  return (
    <div>
      <nav className="tab-nav">
        <button
          className={activeTab === "chandha" ? "active" : ""}
          onClick={() => setActiveTab("chandha")}
        >
          Chandha
        </button>
        <button
          className={activeTab === "gallery" ? "active" : ""}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
        <button
          className={activeTab === "wishes" ? "active" : ""}
          onClick={() => setActiveTab("wishes")}
        >
          Wishes
        </button>
        {/* <button
          className={activeTab === "countdown" ? "active" : ""}
          onClick={() => setActiveTab("countdown")}
        >
          Countdown
        </button> */}
      </nav>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}
