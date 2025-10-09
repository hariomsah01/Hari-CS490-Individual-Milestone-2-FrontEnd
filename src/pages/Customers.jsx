import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Pager from "../components/Pager";

export default function Customers(){
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [rows, setRows] = useState([]);

  const isInt = (s) => /^\d+$/.test(String(s).trim());

  const load = () => {
    const params = { q, page, pageSize };
    if (isInt(q)) params.id = q;
    api.get("/customers", { params }).then(r => setRows(r.data.data || []));
  };

  useEffect(load, [q, page, pageSize]);
  useEffect(() => { setPage(1); }, [q, pageSize]);

  const onDelete = async (id) => {
    if (!window.confirm(`Delete customer #${id}? This cannot be undone.`)) return;
    try {
      await api.delete(`/customers/${id}`);
      load();
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <section className="container">
      <div className="controls" style={{ justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:12 }}>
          <SearchBar
            value={q}
            onChange={(v)=> setQ(v)}
            placeholder="Search by ID or first/last name…"
          />

          <label className="control">
            <span>Rows/page</span>
            <select
              value={pageSize}
              onChange={(e)=>setPageSize(parseInt(e.target.value,10))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>

        <button className="btn" onClick={()=>nav("/customers/new")}>+ New Customer</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="th w-16">ID</th>
              <th className="th w-64">Name</th>
              <th className="th">Email</th>
              <th className="th w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.customer_id} className="tr">
                <td className="td mono">{c.customer_id}</td>
                <td className="td">
                  <Link className="name-link" to={`/customers/${c.customer_id}`}>
                    {c.first_name} {c.last_name}
                  </Link>
                </td>
                <td className="td ellipsis" title={c.email}>{c.email}</td>
                <td className="td">
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn secondary" onClick={()=>nav(`/customers/${c.customer_id}/edit`)}>Edit</button>
                    <button className="btn danger" onClick={()=>onDelete(c.customer_id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td className="td" colSpan={4} style={{ opacity:.7 }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <Pager page={page} setPage={setPage} hasNext={rows.length===pageSize}/>
      </div>
    </section>
  );
}
