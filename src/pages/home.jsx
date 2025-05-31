import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "./home.css";
import { useNavigate } from "react-router-dom";

const restaurantesIniciales = [
  {
    id: "1",
    name: "La Parrilla del Chef",
    desc: "Especialidad en carnes a la brasa.",
    addr: "Av. Principal 123",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
  },
  {
    id: "2",
    name: "Sabor a México",
    desc: "Auténtica comida mexicana.",
    addr: "Calle 8 #45-67",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
  },
  {
    id: "3",
    name: "Pasta & Basta",
    desc: "Pastas y pizzas artesanales.",
    addr: "Carrera 10 #20-30",
    img: "https://www.unileverfoodsolutions.com.co/dam/global-ufs/mcos/NOLA/calcmenu/recipes/col-recipies/italiana/PASTA%20CON%20POLLO%20TOCINETA%20Y%20BECHAMEL-1200x709.jpg"
  },
  {
    id: "4",
    name: "El Mar de Sabores",
    desc: "Pescados y mariscos frescos.",
    addr: "Calle del Mar 50",
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc"
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState(restaurantesIniciales);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [newRest, setNewRest] = useState({
    name: "",
    desc: "",
    addr: "",
    img: ""
  });

  const navigate = useNavigate();

  // Cargar restaurantes desde Firebase
  const fetchRestaurants = async () => {
    try {
      const snapshot = await getDocs(collection(db, "restaurants"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants([...restaurantesIniciales, ...data]);
    } catch (err) {
      setError("Error al cargar los restaurantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line
  }, []);

  const handleInput = e => {
    setNewRest({ ...newRest, [e.target.name]: e.target.value });
  };

  // Guardar restaurante en Firebase y mostrarlo inmediatamente
  const handleAdd = async e => {
    e.preventDefault();
    const tempRest = { ...newRest, id: Date.now().toString() }; // id temporal
    setRestaurants(prev => [tempRest, ...prev]); // Mostrarlo de inmediato
    setNewRest({ name: "", desc: "", addr: "", img: "" });
    setShowForm(false);
    try {
      await addDoc(collection(db, "restaurants"), newRest);
      fetchRestaurants(); // Recargar la lista real desde Firebase
    } catch (err) {
      setError("Error al guardar el restaurante.");
    }
  };

  // Botón Inicio: limpia búsqueda, oculta la caja de búsqueda, oculta el formulario y recarga restaurantes
  const handleInicio = () => {
    setSearchInput("");
    setShowSearchBox(false);
    setShowForm(false);
    fetchRestaurants();
    navigate("/");
  };

  // Búsqueda en tiempo real
  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <div className="mb-3 d-flex flex-column gap-2 flex-md-row align-items-center">
        {/* Botón Buscar o caja de búsqueda */}
        {!showSearchBox ? (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setShowSearchBox(true)}
            style={{ maxWidth: 300 }}
          >
            Buscar
          </button>
        ) : (
          <div className="input-group" style={{ maxWidth: 300 }}>
            <input
              type="text"
              placeholder="Buscar restaurante..."
              className="form-control"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              autoFocus
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                setShowSearchBox(false);
                setSearchInput("");
              }}
              title="Cerrar búsqueda"
            >
              ✕
            </button>
          </div>
        )}
        {/* Botón Inicio */}
        <button
          className="btn btn-secondary ms-md-2 mt-2 mt-md-0"
          onClick={handleInicio}
          type="button"
        >
          Inicio
        </button>
        {/* Botón Nuevo Restaurante */}
        {!showForm && (
          <button
            className="btn btn-success ms-md-2 mt-2 mt-md-0"
            onClick={() => setShowForm(true)}
            type="button"
          >
            Nuevo Restaurante
          </button>
        )}
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
      <div className="row row-cols-1 row-cols-md-2 g-5">
        {filtered.length === 0 ? (
          <div>No hay restaurantes registrados.</div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id + r.name}
              className="border rounded p-3 mb-4"
              style={{
                background: "#f4f6f6",
                minHeight: 200,
                flexDirection: "row",
                gap: 45,
                boxShadow: "0 4px 16px rgba(52, 123, 210, 0.1)",
                maxWidth: 500,
                textAlign: "center",
                margin: "0 auto",




              }}
            >
              <img
                src={r.img || "https://via.placeholder.com/240x180"}
                alt={r.name}
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
                <strong style={{ fontSize: 22, display: "block", marginBottom: 8 }}>{r.name}</strong>
                <div style={{ fontSize: 16, marginBottom: 6 }}>{r.desc}</div>
                <div style={{ fontSize: 14, color: "#555" }}>{r.addr}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {loading && <div>Cargando restaurantes...</div>}
    </div>
  );
}