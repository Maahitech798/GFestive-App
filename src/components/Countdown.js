import React, { useEffect, useState } from "react";

const festivalDate = new Date("2025-08-29"); // Change to actual festival date

export default function Countdown() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const diff = (festivalDate - today) / (1000 * 60 * 60 * 24);
      setDays(Math.max(0, Math.floor(diff)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>Days until Ganesh Festival: {days}</div>;
}
