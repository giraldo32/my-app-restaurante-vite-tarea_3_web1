import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Search from "./pages/Search";
import NewRestaurant from "./pages/NewRestaurant";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Home />} />
        <Route path="/nuevo" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}