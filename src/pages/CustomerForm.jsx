// src/pages/CustomerForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function CustomerForm() {
  const nav = useNavigate();
  const { id } = useParams();          // <-- present only on /customers/:id/edit
  const isEdit = Boolean(id);

  const [first, setFirst]   = useState("");
  const [last, setLast]     = useState("");
  const [email, setEmail]   = useState("");
  const [cid, setCid]       = useState(""); // only used in create
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(isEdit);

  // If editing, load existing customer once
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
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
    })();

    return () => { cancelled = true; };
  }, [isEdit, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // PATCH existing
        await api.patch(`/customers/${id}`, {
          first_name: first,
          last_name : last,
          email     : email,
          active    : active,
        });
        alert("Updated!");
        nav(`/customers/${id}`);
      } else {
        // POST new
        const payload = { first_name: first, last_name: last, email };
        if (cid.trim()) payload.customer_id = Number(cid.trim());
        const res = await api.post("/customers", payload);
        alert("Saved!");
        nav(`/customers/${res.data.id}`);
      }
    } catch (err) {
      alert(err?.response?.data?.error || (isEdit ? "Failed to update" : "Failed to save"));
    }
  };

  if (loading) {
    return (
      <section className="container">
        <div className="card">Loading…</div>
      </section>
    );
  }

  return (
    <section className="container" style={{ maxWidth: 560 }}>
      <h1 className="h1">{isEdit ? "Edit Customer" : "Add Customer"}</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        {isEdit ? (
          // show the ID in read-only mode while editing
          <label className="grid gap-1">
            <span>Customer ID</span>
            <input
              className="card"
              value={id}
              readOnly
              style={{ color:"#bbb", background:"#111", border:"1px solid #333" }}
            />
          </label>
        ) : (
          // new-customer only: optional custom id
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
        )}

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

        {isEdit && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e)=>setActive(e.target.checked)}
            />
            <span>Active</span>
          </label>
        )}

        <div className="flex gap-2">
          <button className="btn" type="submit">
            {isEdit ? "Save Changes" : "Create Customer"}
          </button>
          <button
            className="btn secondary"
            type="button"
            onClick={()=> nav(isEdit ? `/customers/${id}` : "/customers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
