import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function FilmDetail(){
  const { id } = useParams();
  const [film,setFilm]=useState(null);
  const [available,setAvailable]=useState(null);
  const [cid,setCid]=useState("");

  const load = async ()=>{
    const f = await api.get(`/films/${id}`);
    setFilm(f.data.data);
    const a = await api.get(`/films/${id}/availability?store_id=1`);
    setAvailable(a.data.data);
  };

  useEffect(()=>{ load(); },[id]);

  const rent = async ()=>{
    if(!available) return alert("No copies available");
    if(!cid) return alert("Enter customer id");
    const res = await api.post("/rentals", { customer_id:Number(cid), film_id:Number(id), store_id:1 });
    alert(`Rented! rental_id=${res.data.data.rental_id}`);
    await load();
  };

  if(!film) return <div>Loading…</div>;
  return (
    <section className="grid gap-2">
      <h2 className="text-xl font-semibold">{film.title}</h2>
      <div className="opacity-80">{film.description}</div>
      <div>Year: {film.release_year} • Rating: {film.rating} • Length: {film.length} min • Category: {film.category}</div>
      <div>Actors: {film.actors.map(a=>a.actor_name).join(", ")}</div>
      <div className="mt-2">
        <div>Availability at Store 1: {available ? "Available" : "Unavailable"}</div>
        <div className="flex gap-2 mt-2">
          <input className="border p-1" placeholder="Customer ID" value={cid} onChange={e=>setCid(e.target.value)}/>
          <button className="border px-3" onClick={rent} disabled={!available}>Rent</button>
        </div>
      </div>
      <Link className="text-sm underline" to="/films">← Back to Films</Link>
    </section>
  );
}
