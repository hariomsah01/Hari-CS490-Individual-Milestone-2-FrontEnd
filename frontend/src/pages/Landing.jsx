import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Landing() {
  const [rows,setRows]=useState([]);
  useEffect(()=>{ api.get("/films/top?limit=5").then(r=>setRows(r.data.data)) },[]);
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Top 5 Rented Films</h2>
      <ul className="grid gap-2">
        {rows.map(f=>(
          <li key={f.film_id} className="border p-3 rounded">
            <Link to={`/films/${f.film_id}`} className="font-medium">{f.title}</Link>
            <div className="text-sm opacity-70">{f.times_rented} rentals</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
