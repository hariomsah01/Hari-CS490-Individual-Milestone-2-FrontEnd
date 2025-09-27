import { Outlet, Link, useLocation } from "react-router-dom";

export default function App(){
  const loc = useLocation();
  const is = (p)=> loc.pathname===p || loc.pathname.startsWith(p) ? "active" : "";
  return (
    <div>
      <header className="site-header">
        <div className="wrap">
          <div className="brand">SAKILA.</div>
          <nav className="nav">
            <Link className={is("/")} to="/">Home</Link>
            <Link className={is("/films")} to="/films">Films</Link>
            <Link className={is("/customers")} to="/customers">Customer</Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
