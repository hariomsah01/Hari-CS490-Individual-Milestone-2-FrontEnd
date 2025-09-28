import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Link, useSearchParams } from "react-router-dom";

export default function Films(){
  const [params,setParams] = useSearchParams();
  const [mode,setMode] = useState(params.get("actor") ? "actor" : params.get("category") ? "category" : "title");
  const [q,setQ] = useState(params.get("actor") || params.get("category") || "");

  const [page,setPage]=useState(1);
  const [rows,setRows]=useState([]);
  const pageSize=12;

  useEffect(()=>{
    const p = { page, pageSize };
    if (mode==="actor") p.actor=q; else if (mode==="category") p.category=q; else p.q=q;
    api.get("/films/search",{ params:p }).then(r=>setRows(r.data.data));
  },[q, mode, page]);

  return (
    <section>
      <h1 className="h1" style={{textAlign:"left"}}>Films</h1>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button className={`btn ${mode==="title"?"":""}`} onClick={()=>{setMode("title");setQ("");}}>Title</button>
        <button className={`btn ${mode==="actor"?"":""}`} onClick={()=>{setMode("actor");setQ("");}}>Actor</button>
        <button className={`btn ${mode==="category"?"":""}`} onClick={()=>{setMode("category");setQ("");}}>Genre</button>
      </div>
      <form onSubmit={e=>e.preventDefault()} style={{display:"flex",gap:8,marginBottom:18}}>
<input 
  className="card" 
  style={{
    padding:"10px 12px",
    width:"320px",
    color:"white",          // 👈 this makes typed letters white
    backgroundColor:"#111"  // optional: dark background for better contrast
  }} 
  placeholder={`Search by ${mode}...`} 
  value={q} 
  onChange={e=>setQ(e.target.value)} 
/>        <button className="btn" onClick={()=>setPage(1)}>Search</button>
      </form>

      <div className="row">
        {rows.map(f=>(
          <Link to={`/films/${f.film_id}`} key={f.film_id} className="card" style={{textDecoration:"none",color:"#111"}}>
            <div className="icon">🎬</div>
            <div className="title">{f.title}</div>
            <div className="meta">Open details</div>
          </Link>
        ))}
      </div>

      <div style={{display:"flex",gap:10,marginTop:18}}>
        <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span style={{alignSelf:"center"}}>Page {page}</span>
        <button className="btn" disabled={rows.length<pageSize} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </section>
  );
}
