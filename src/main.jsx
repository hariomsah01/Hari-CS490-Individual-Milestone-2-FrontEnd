import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Landing from "./pages/Landing.jsx";
import Films from "./pages/Films.jsx";
import FilmDetail from "./pages/FilmDetail.jsx";
import Customers from "./pages/Customers.jsx";
import CustomerDetail from "./pages/CustomerDetail.jsx";
import ActorDetail from "./pages/ActorDetail.jsx";   // ✅ NEW IMPORT
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Landing />} />
        <Route path="/films" element={<Films />} />
        <Route path="/films/:id" element={<FilmDetail />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/actors/:id" element={<ActorDetail />} />   {/* ✅ NEW ROUTE */}
      </Route>
    </Routes>
  </BrowserRouter>
);
