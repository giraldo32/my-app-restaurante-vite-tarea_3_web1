import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#f8f9fa", padding: "16px 0", marginBottom: 50 }}>
      <div
        style={{
          background: "#dee2e6", // gris más oscuro, igual que el de las cards de Bootstrap
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          padding: "12px 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
                <h1
          style={{
            fontWeight: "bold",
            color: "#212529", // gris más oscuro para el título
            margin: 0,
            textAlign: "center"
          }}
        >
          Restaurantes
        </h1>
      </div>
    </nav>
  );
}