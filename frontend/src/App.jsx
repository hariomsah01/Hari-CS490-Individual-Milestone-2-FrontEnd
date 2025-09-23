import { Outlet, Link, useLocation } from "react-router-dom";

export default function App() {
  const loc = useLocation();
  const active = (p) => (loc.pathname.startsWith(p) || loc.pathname===p ? "font-semibold" : "");
  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4">
      <header className="flex gap-4 items-center mb-6">
        <h1 className="text-2xl font-bold">Sakila Online Rentals</h1>
        <nav className="flex gap-3 text-sm">
          <Link to="/" className={active("/")}>Home</Link>
          <Link to="/films" className={active("/films")}>Films</Link>
          <Link to="/customers" className={active("/customers")}>Customers</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
