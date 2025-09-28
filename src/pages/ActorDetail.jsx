import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function ActorDetail() {
  // handle any param name: /actors/:id OR /actors/:actor_id OR /actors/:actorId
  const params = useParams();
  const actorId = useMemo(() => params.id || params.actor_id || params.actorId, [params]);
  const [actor, setActor] = useState(null);
  const [films, setFilms] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (!actorId) return;
    setStatus("loading");

    const getActor = api.get(`/actors/${actorId}`);
    const getTop = api.get(`/actors/${actorId}/top-films`);

    Promise.all([getActor, getTop])
      .then(([a, f]) => {
        setActor(a.data?.data ?? null);
        setFilms(f.data?.data ?? []);
        setStatus("ok");
      })
      .catch((err) => {
        console.error(err);
        setMessage(err?.response?.data?.error || "Failed to load actor details.");
        setStatus("error");
      });
  }, [actorId]);

  if (status === "loading") {
    return (
      <section className="card" style={{maxWidth:900, margin:"32px auto"}}>
        Loading...
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="card" style={{maxWidth:900, margin:"32px auto"}}>
        <div style={{color:"#f87171", fontWeight:700}}>Error</div>
        <div className="meta" style={{marginTop:6}}>{message}</div>
        <div style={{marginTop:12}}>
          <button className="btn secondary" onClick={()=>nav(-1)}>Go Back</button>
        </div>
      </section>
    );
  }

  if (!actor) {
    return (
      <section className="card" style={{maxWidth:900, margin:"32px auto"}}>
        Actor not found.
      </section>
    );
  }

  return (
    <section>
      <h1 className="h1">{actor.actor_name} <span className="accent">({actor.film_count} films)</span></h1>

      <h2 className="h1" style={{fontSize:28, marginTop:10}}>Top 5 Rented Films</h2>
      <div className="row">
        {films.map((f)=>(
          <div className="card" key={f.film_id}>
            <div className="title">{f.title}</div>
            <div className="meta">Rented {f.rental_count} times</div>
            <button className="btn" onClick={()=>nav(`/films/${f.film_id}`)}>Open Film</button>
          </div>
        ))}
        {!films.length && <div style={{opacity:.7}}>No rentals found for this actor.</div>}
      </div>

      <div style={{marginTop:18}}>
        <Link className="btn secondary" to="/">Back to Home</Link>
      </div>
    </section>
  );
}
