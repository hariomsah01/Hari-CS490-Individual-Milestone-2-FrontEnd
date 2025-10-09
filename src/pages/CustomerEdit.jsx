// src/pages/CustomerEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function CustomerEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [first, setFirst]   = useState("");
  const [last, setLast]     = useState("");
  const [email, setEmail]   = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load existing customer
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        // Use the light endpoint if you added it; fall back to the full detail
        const res =
          await api.get(`/customers/basic/${id}`).catch(() =>
            api.get(`/customers/${id}`)
          );

        const c = res.data.data;
        if (!cancelled && c) {
          setFirst(c.first_name || "");
          setLast(c.last_name || "");
          setEmail(c.email || "");
          setActive(Boolean(c.active));
        }
      } catch (err) {
        alert(err?.response?.data?.error || "Failed to load customer");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  // Save edits
  const save = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/customers/${id}`, {
        first_name: first,
        last_name : last,
        email     : email,
        active    : active,
      });
      alert("Updated!");
      nav(`/customers/${id}`);
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to update");
    }
  };

  if (loading) return <section className="container"><div className="card">Loading…</div></section>;

  return (
    <section className="container" style={{maxWidth: 560}}>
      <h1 className="h1">Edit Customer</h1>

      <form onSubmit={save} className="grid gap-3">
        {/* ID should NOT be editable */}
        <div className="grid gap-1">
          <span className="opacity-80">Customer ID</span>
          <input
            className="card"
            value={id}
            readOnly
            style={{ color:"#bbb", background:"#111", border:"1px solid #333" }}
          />
        </div>

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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e)=>setActive(e.target.checked)}
          />
          <span>Active</span>
        </label>

        <div className="flex gap-2">
          <button className="btn" type="submit">Save Changes</button>
          <button className="btn secondary" type="button" onClick={()=>nav(`/customers/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
