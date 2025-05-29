import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#f8f9fa", padding: "16px 0", marginBottom: 24 }}>
      <div className="container d-flex flex-column align-items-center">
        <h1 style={{ fontWeight: "bold", marginBottom: 12, color: "#212529" }}>Restaurantes</h1>
        
      </div>
    </nav>
  );
}