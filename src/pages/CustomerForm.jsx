// src/pages/CustomerForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function CustomerForm() {
  const nav = useNavigate();
  const [first, setFirst] = useState("");
  const [last, setLast]   = useState("");
  const [email, setEmail] = useState("");
  const [cid, setCid]     = useState(""); // optional manual ID

  // CustomerForm.jsx
const save = async (e) => {
  e.preventDefault();
  try {
    const payload = { first_name:first, last_name:last, email };
    if (cid.trim()) payload.customer_id = Number(cid.trim());

    // add the slash here ⬇️
    const res = await api.post("/customers/", payload);
    alert("Saved!");
    nav(`/customers/${res.data.id}`);
  } catch (err) {
    alert(err?.response?.data?.error || "Failed to save");
  }
};


  return (
    <section className="container">
      <h1 className="h1">Add Customer</h1>

      <form onSubmit={save} className="grid gap-3" style={{maxWidth: 520}}>
        <label className="grid gap-1">
          <span>Customer ID (optional)</span>
          <input
            className="card"
            value={cid}
            onChange={(e)=>setCid(e.target.value)}
            placeholder="If left blank, auto-generated"
            style={{ color:"#fff", background:"#111", border:"1px solid #444" }}
          />
        </label>

        <label className="grid gap-1">
          <span>First name</span>
          <input
            className="card"
            required
            value={first}
            onChange={(e)=>setFirst(e.target.value)}
            style={{ color:"#fff", background:"#111", border:"1px solid #444" }}
          />
        </label>

        <label className="grid gap-1">
          <span>Last name</span>
          <input
            className="card"
            required
            value={last}
            onChange={(e)=>setLast(e.target.value)}
            style={{ color:"#fff", background:"#111", border:"1px solid #444" }}
          />
        </label>

        <label className="grid gap-1">
          <span>Email</span>
          <input
            className="card"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{ color:"#fff", background:"#111", border:"1px solid #444" }}
          />
        </label>

        <div className="flex gap-2">
          <button className="btn" type="submit">Create Customer</button>
          <button className="btn secondary" type="button" onClick={()=>nav("/customers")}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
