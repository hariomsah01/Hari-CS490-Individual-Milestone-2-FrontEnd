import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

const MovieIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#111" strokeWidth="2"/>
    <path d="M7 5l2 4M11 5l2 4M15 5l2 4" stroke="#111" strokeWidth="2"/>
  </svg>
);

export default function Landing(){
  const [films,setFilms]=useState([]);
  const [actors,setActors]=useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    api.get("/films/top?limit=5").then(r=>setFilms(r.data.data)).catch(()=>setFilms([]));
    api.get("/actors/top").then(r=>setActors(r.data.data)).catch(()=>setActors([]));
  },[]);

  return (
    <>
      <h1 className="h1">Top 5 Movies</h1>
      <div className="row">
        {films.map(f=>(
          <div className="card" key={f.film_id}>
            <div className="icon"><MovieIcon/></div>
            <div className="title">{f.title}</div>
            <div className="meta">Rental Count: {f.times_rented}</div>
            <button className="btn" onClick={()=>nav(`/films/${f.film_id}`)}>See More</button>
          </div>
        ))}
        {!films.length && <div style={{opacity:.6}}>No movies found.</div>}
      </div>

      <section className="section-dark">
        <h1 className="h1">Top 5 Actors</h1>
        <div className="row">
          {actors.map(a=>(
            <div className="card" key={a.actor_id}>
              <div className="icon"><span style={{fontWeight:900}}>👤</span></div>
              <div className="title">{a.actor_name}</div>
              <div className="meta">Movie Count: {a.film_count}</div>
              <Link className="btn" to={`/films?actor=${encodeURIComponent(a.actor_name)}`}>See More</Link>
            </div>
          ))}
          {!actors.length && <div style={{color:"#fff",opacity:.7}}>No actors found.</div>}
        </div>
      </section>
    </>
  );
}
