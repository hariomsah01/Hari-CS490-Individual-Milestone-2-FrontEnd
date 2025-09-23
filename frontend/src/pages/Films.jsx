import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Pager from "../components/Pager";

export default function Films(){
  const [mode,setMode]=useState("title"); // title | actor | category
  const [q,setQ]=useState("");
  const [page,setPage]=useState(1);
  const [rows,setRows]=useState([]);
  const pageSize=10;

  useEffect(()=>{
    const params = { page, pageSize };
    if (mode==="actor") params.actor=q;
    else if (mode==="category") params.category=q;
    else params.q=q;
    api.get("/films/search",{ params }).then(r=>setRows(r.data.data));
  },[q, mode, page]);

  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <label><input type="radio" checked={mode==="title"} onChange={()=>setMode("title")}/> Title</label>
        <label><input type="radio" checked={mode==="actor"} onChange={()=>setMode("actor")}/> Actor</label>
        <label><input type="radio" checked={mode==="category"} onChange={()=>setMode("category")}/> Genre</label>
      </div>
      <SearchBar value={q} onChange={setQ} placeholder={`Search by ${mode}...`} />
      <ul className="grid gap-2">
        {rows.map(f=>(
          <li key={f.film_id} className="border p-3 rounded">
            <Link to={`/films/${f.film_id}`} className="font-medium">{f.title}</Link>
          </li>
        ))}
        {!rows.length && <div className="opacity-70">No results</div>}
      </ul>
      <Pager page={page} setPage={setPage} hasNext={rows.length===pageSize}/>
    </section>
  );
}
