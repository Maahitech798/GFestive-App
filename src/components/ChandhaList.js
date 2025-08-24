import React, { useEffect, useState } from "react";
import { addChandha, getAllChandha, deleteChandha, updateChandha } from "../utils/chandhaDB";

export default function ChandhaList() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", note: "" });
  const [editEntry, setEditEntry] = useState(null);

  useEffect(() => {
    loadChandha();
  }, []);

  const loadChandha = async () => {
    const d = await getAllChandha();
    setEntries(d.sort((a, b) => b.amount - a.amount));
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    await addChandha({ ...form, amount: Number(form.amount), date: new Date().toLocaleDateString() });
    setForm({ name: "", amount: "", note: "" });
    loadChandha();
  };

  const handleDelete = async id => {
    await deleteChandha(id);
    loadChandha();
  };

  const handleEdit = entry => setEditEntry(entry);

  const handleUpdate = async e => {
    e.preventDefault();
    await updateChandha(editEntry);
    setEditEntry(null);
    loadChandha();
  };

  const handleEditChange = e => setEditEntry({ ...editEntry, [e.target.name]: e.target.value });

  const totalCollected = entries.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="centered-container" style={{ maxWidth: 480 }}>
      <h2>Chandha Collection</h2>
      <div className="chandha-total-amount">Total Collected: ₹{totalCollected}</div>
      
      <form className="chandha-form" onSubmit={editEntry ? handleUpdate : handleAdd}>
        <input name="name" value={editEntry ? editEntry.name : form.name} onChange={editEntry ? handleEditChange : handleChange} placeholder="Contributor name" required />
        <input name="amount" type="number" value={editEntry ? editEntry.amount : form.amount} onChange={editEntry ? handleEditChange : handleChange} placeholder="Amount (₹)" required />
        <input name="note" value={editEntry ? editEntry.note : form.note} onChange={editEntry ? handleEditChange : handleChange} placeholder="Note (optional)" />
        <button type="submit" style={{ background: '#d35400', color: '#fff' }}>{editEntry ? "Update" : "Add"}</button>
        {editEntry && <button type="button" onClick={() => setEditEntry(null)}>Cancel</button>}
      </form>
      
      <div style={{ marginTop: 18 }}>
        {entries.map(e => (
          <div key={e.id} className="chandha-card" style={e.amount >= 1000 ? { borderColor: "#d35400" } : {}}>
            <div><strong>{e.name}</strong> <span style={{ color: "#27ae60" }}>₹{e.amount}</span></div>
            <div style={{ fontSize: 13, color: "#555" }}>{e.note}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{e.date}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => handleEdit(e)} className="chandha-btn">Edit</button>
              <button onClick={() => handleDelete(e.id)} className="chandha-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
