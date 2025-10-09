import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Link, useSearchParams } from "react-router-dom";

export default function Films() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(
    params.get("actor") ? "actor" :
    params.get("category") ? "category" :
    "title"
  );
  const [query, setQuery] = useState(
    params.get("actor") || params.get("category") || ""
  );

  const [page, setPage] = useState(1);
  const [films, setFilms] = useState([]);
  const pageSize = 12;

  useEffect(() => {
    const p = { page, pageSize };
    if (mode === "actor") p.actor = query;
    else if (mode === "category") p.category = query;
    else p.q = query;

    api.get("/films/search", { params: p })
      .then(r => setFilms(r.data.data || []))
      .catch(() => setFilms([]));
  }, [query, mode, page]);

  return (
    <section>
      <h1 className="h1" style={{ textAlign: "left" }}>Films</h1>

      {/* Filter buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["title", "actor", "category"].map(opt => (
          <button
            key={opt}
            className={`btn ${mode === opt ? "active" : ""}`}
            onClick={() => { setMode(opt); setQuery(""); setPage(1); }}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); setPage(1); }}
        style={{ display: "flex", gap: 8, marginBottom: 18 }}
      >
        <input
          className="card"
          style={{
            padding: "10px 12px",
            width: "320px",
            color: "white",
            backgroundColor: "#111",
            border: "1px solid #333",
          }}
          placeholder={`Search by ${mode}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" onClick={() => setPage(1)}>
          Search
        </button>
      </form>

      {/* Film grid */}
      <div className="row">
        {films.map(f => (
          <Link
            to={`/films/${f.film_id}`}
            key={f.film_id}
            className="card"
            style={{ textDecoration: "none", color: "white" }}
          >
            <div className="icon">🎬</div>
            <div className="title">{f.title}</div>
            <div className="meta">View Details</div>
          </Link>
        ))}
        {!films.length && <div style={{ opacity: 0.7 }}>No films found.</div>}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>
        <span style={{ alignSelf: "center" }}>Page {page}</span>
        <button
          className="btn"
          disabled={films.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
