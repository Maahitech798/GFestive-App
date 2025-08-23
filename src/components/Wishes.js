import React, { useState } from "react";

export default function Wishes() {
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState(JSON.parse(localStorage.getItem("wishes")) || []);

  const handleSubmit = e => {
    e.preventDefault();
    const updated = [...wishes, wish];
    setWishes(updated);
    localStorage.setItem("wishes", JSON.stringify(updated));
    setWish("");
  };

  return (
    <div className="centered-container">
      <h2>Share Your Wishes</h2>
      <form onSubmit={handleSubmit}>
        <input value={wish} onChange={e => setWish(e.target.value)} placeholder="Write your Ganesh wish" required />
        <button type="submit">Submit Wish</button>
      </form>
      <ul>
        {wishes.map((w, i) => (<li key={i}>{w}</li>))}
      </ul>
    </div>
  );
}
