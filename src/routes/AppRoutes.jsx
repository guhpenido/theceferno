import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Home } from "../pages/Home";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
