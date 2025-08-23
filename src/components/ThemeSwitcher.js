// import React from "react";

// export default function ThemeSwitcher() {
//   const changeTheme = theme => {
//     document.documentElement.setAttribute("data-theme", theme);
//   };

//   return (
//     <div >
//       <button onClick={() => changeTheme("light")}>Light Theme</button>
//       <button onClick={() => changeTheme("festive")}>Festive Theme</button>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  // Initial theme from the root attribute or default to "light"
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Toggle function for checkbox
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "festive" : "light"));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px" }}>
      <label className="switch">
        <input type="checkbox" checked={theme === "festive"} onChange={toggleTheme} />
        <span className="slider"></span>
      </label>
      <span>{theme === "festive" ? "Festive" : "Light"} Theme</span>
    </div>
  );
}
