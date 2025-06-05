import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "./home.css";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [newRest, setNewRest] = useState({
    name: "",
    desc: "",
    addr: "",
    img: ""
  });

  
  const fetchRestaurants = async () => {
    try {
      const snapshot = await getDocs(collection(db, "restaurants"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(data);
    } catch (err) {
      setError("Error al cargar los restaurantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    
  }, []);

  const handleInput = e => {
    setNewRest({ ...newRest, [e.target.name]: e.target.value });
  };

  
  const handleAdd = async e => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "restaurants"), newRest);
      setRestaurants(prev => [
        { ...newRest, id: docRef.id },
        ...prev
      ]);
      setNewRest({ name: "", desc: "", addr: "", img: "" });
      setShowForm(false);
    } catch (err) {
      setError("Error al guardar el restaurante.");
    }
  };

  const filtered = restaurants.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <div className="mb-3 d-flex flex-column gap-2">
        <input
          type="text"
          placeholder="Buscar restaurante..."
          className="form-control"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => setShowForm(true)}>Nuevo Restaurante</button>
      </div>

      {showForm && (
        <form className="mb-4" onSubmit={handleAdd}>
          <input
            name="name"
            placeholder="Nombre"
            className="form-control mb-2"
            value={newRest.name}
            onChange={handleInput}
            required
          />
          <input
            name="desc"
            placeholder="Descripción"
            className="form-control mb-2"
            value={newRest.desc}
            onChange={handleInput}
            required
          />
          <input
            name="addr"
            placeholder="Dirección"
            className="form-control mb-2"
            value={newRest.addr}
            onChange={handleInput}
            required
          />
          <input
            name="img"
            placeholder="URL de la imagen"
            className="form-control mb-2"
            value={newRest.img}
            onChange={handleInput}
            required
          />
          <button className="btn btn-primary" type="submit">Guardar</button>
          <button className="btn btn-secondary ms-2" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
        </form>
      )}

      <h2 className="mb-3">Restaurantes</h2>
      <div>
        {filtered.length === 0 ? (
          <div>No hay restaurantes registrados.</div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="d-flex align-items-center border rounded p-3 mb-3"
              style={{
                background: "#f8f9fa",
                minHeight: 140,
                flexDirection: "row",
                gap: 24
              }}
            >
              <img
                src={r.img || "https://via.placeholder.com/160x120"}
                alt={r.name}
                style={{
                  width: 160,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginRight: 24
                }}
              />
              <div>
                <strong style={{ fontSize: 22 }}>{r.name}</strong>
                <div style={{ fontSize: 16, margin: "8px 0" }}>{r.desc}</div>
                <div style={{ fontSize: 15, color: "#555" }}>{r.addr}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {loading && <div>Cargando restaurantes...</div>}
    </div>
  );
}