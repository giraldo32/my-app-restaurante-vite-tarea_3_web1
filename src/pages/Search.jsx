import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Search() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const snapshot = await getDocs(collection(db, "restaurants"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(data);
      setLoading(false);
    };
    getData();
  }, []);

  const filtered = restaurants.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <h2>Buscar Restaurantes</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoFocus
      />
      <div>
        {loading ? (
          <div>
            <p>Cargando restaurantes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div>
            <p>No se encontraron restaurantes.</p>
          </div>
        ) : (
          filtered.map(rest => (
            <div
              key={rest.id}
              className="d-flex align-items-center border rounded p-4 mb-4"
              style={{
                background: "#f8f9fa",
                minHeight: 200,
                flexDirection: "row",
                gap: 32,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                maxWidth: 900
              }}
            >
              <img
                src={rest.img || "https://via.placeholder.com/240x180"}
                alt={rest.name}
                style={{
                  width: 240,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginRight: 32,
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{rest.name}</strong>
                <div style={{ fontSize: 18, marginBottom: 10 }}>{rest.desc}</div>
                <div style={{ fontSize: 16, color: "#555" }}>{rest.addr}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}