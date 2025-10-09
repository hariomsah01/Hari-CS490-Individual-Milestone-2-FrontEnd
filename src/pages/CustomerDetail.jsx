import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function CustomerDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [data,setData]=useState(null);

  const load = () => 
  api.get(`/customers/detail/${id}`)
     .then(r => setData(r.data.data))
     .catch(() => alert("Failed to load customer details"));

  useEffect(()=>{ load(); },[id]);

  const markReturn = async (rentalId)=>{
    await api.patch(`/rentals/${rentalId}/return`);
    await load();
  };

  const onDelete = async ()=>{
    if (!window.confirm(`Delete customer #${id}?`)) return;
    try {
      await api.delete(`/customers/${id}`);
      nav("/customers");
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  if(!data) return <div>Loading…</div>;
  return (
    <section>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 className="text-xl font-semibold">
          {data.first_name} {data.last_name}
        </h2>
        <div style={{ display:"flex", gap:8 }}>
          <Link className="btn secondary" to={`/customers/${id}/edit`}>Edit</Link>
          <button className="btn danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      <div className="opacity-80 mb-3">
        {data.email} • Active: {data.active ? "Yes" : "No"}
      </div>

      <h3 className="font-semibold mb-1">Recent Rentals</h3>
      <ul className="grid gap-2">
        {data.rentals.map(r=>(
          <li key={r.rental_id} className="border p-3 rounded">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm opacity-70">
              Rented: {new Date(r.rental_date).toLocaleString()}
            </div>
            <div className="text-sm">
              {r.return_date
                ? <>Returned: {new Date(r.return_date).toLocaleString()}</>
                : <button className="border px-3" onClick={()=>markReturn(r.rental_id)}>Mark Return</button>}
            </div>
          </li>
        ))}
        {!data.rentals.length && <div className="opacity-70">No rentals</div>}
      </ul>
    </section>
  );
}
