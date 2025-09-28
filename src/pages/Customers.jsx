import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Pager from "../components/Pager";

export default function Customers(){
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // show more per page (10→25)
  const [rows, setRows] = useState([]);

  const isInt = (s) => /^\d+$/.test(String(s).trim());

  useEffect(() => {
    const params = { q, page, pageSize };
    if (isInt(q)) params.id = q;           // numeric search = search by ID too
    api.get("/customers", { params }).then(r => setRows(r.data.data));
  }, [q, page, pageSize]);

  // keep page valid when pageSize changes
  useEffect(() => { setPage(1); }, [q, pageSize]);

  return (
    <section className="container">
      {/* Controls row */}
      <div className="controls">
        <SearchBar
          value={q}
          onChange={(v)=>{ setQ(v); /* SearchBar likely debounces; if not, it’s still fine */ }}
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

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="th w-16">ID</th>
              <th className="th w-64">Name</th>
              <th className="th">Email</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <Pager page={page} setPage={setPage} hasNext={rows.length===pageSize}/>
      </div>
    </section>
  );
}
