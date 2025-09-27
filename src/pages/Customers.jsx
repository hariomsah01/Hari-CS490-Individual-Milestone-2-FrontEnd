import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Pager from "../components/Pager";

export default function Customers(){
  const [q,setQ]=useState("");
  const [page,setPage]=useState(1);
  const [rows,setRows]=useState([]);
  const pageSize=10;

  useEffect(()=>{
    api.get("/customers", { params:{ q, page, pageSize }}).then(r=>setRows(r.data.data));
  },[q, page]);

  return (
    <section>
      <SearchBar value={q} onChange={setQ} placeholder="Search by first/last name…" />
      <table className="w-full border">
        <thead><tr className="text-left">
          <th className="p-2 border-r">ID</th><th className="p-2 border-r">Name</th><th className="p-2">Email</th>
        </tr></thead>
        <tbody>
          {rows.map(c=>(
            <tr key={c.customer_id} className="border-t">
              <td className="p-2">{c.customer_id}</td>
              <td className="p-2">
                <Link className="underline" to={`/customers/${c.customer_id}`}>{c.first_name} {c.last_name}</Link>
              </td>
              <td className="p-2">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} setPage={setPage} hasNext={rows.length===pageSize}/>
    </section>
  );
}
