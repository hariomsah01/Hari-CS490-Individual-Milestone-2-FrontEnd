import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function FilmDetail() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [availability, setAvailability] = useState(null); // { total_copies, available }
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      // fetch film + availability in parallel
      const [filmRes, availRes] = await Promise.all([
        api.get(`/films/${id}`),
        api.get(`/rentals/availability/${id}`, { params: { store_id: 1 } }),
      ]);
      setFilm(filmRes.data.data);
      setAvailability(availRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const rent = async () => {
    if (!availability || (availability.available ?? 0) <= 0) {
      return alert("No copies available");
    }
    if (!customerId) {
      return alert("Enter customer id");
    }

    try {
      // (optional) optimistic: reflect 4->3 immediately
      setAvailability(a =>
        a ? { ...a, available: Math.max(0, (a.available ?? 0) - 1) } : a
      );

      const res = await api.post("/rentals", {
        customer_id: Number(customerId),
        film_id: Number(id),
        store_id: 1,
      });

      // Uncomment if you want a toast/alert:
      // alert(`Rented! rental_id=${res.data.data.rental_id}`);

      // resync from server to be 100% accurate
      await load();
    } catch (err) {
      console.error(err);
      // rollback optimistic change on error
      setAvailability(a =>
        a ? { ...a, available: (a.available ?? 0) + 1 } : a
      );
      alert(err?.response?.data?.error || "Failed to rent film");
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (!film) return <div className="card">Film not found.</div>;

  return (
    <section className="grid gap-3">
      <h1 className="h1">{film.title}</h1>

      <div className="meta opacity-80">{film.description}</div>
      <div className="meta">
        Year: {film.release_year} • Rating: {film.rating} • Length: {film.length} min
      </div>
      <div className="meta">
        Category: {film.category} • Actors: {film.actors.map(a => a.actor_name).join(", ")}
      </div>

      {availability && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="title" style={{ marginBottom: 12 }}>
            <strong>Available Copies:</strong>{" "}
            {availability.available ?? 0} / {availability.total_copies ?? 0}
          </div>

          <div className="flex gap-2 mt-1" style={{ alignItems: "center" }}>
            <input
              type="number"
              min="1"
              className="card"
              placeholder="Enter Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  rent();
                }
              }}
              style={{
                padding: "10px 12px",
                width: "220px",
                color: "white",
                backgroundColor: "#111",
                border: "1px solid #444",
                borderRadius: 10,
              }}
            />

            <button
              className="btn"
              onClick={rent}
              disabled={!availability || (availability.available ?? 0) <= 0 || !customerId}
              style={{ position: "relative", zIndex: 1 }}
              title={
                !customerId
                  ? "Enter a customer ID"
                  : (availability?.available ?? 0) <= 0
                  ? "No copies available"
                  : "Rent this film"
              }
            >
              Rent Film
            </button>
          </div>
        </div>
      )}

      <Link className="text-sm underline mt-4" to="/films">
        ← Back to Films
      </Link>
    </section>
  );
}
