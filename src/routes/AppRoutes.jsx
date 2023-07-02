import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
