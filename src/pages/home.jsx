import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "./home.css";
import { useNavigate, useLocation } from "react-router-dom";

// ICONOS DE REACT-ICONS
import { FaSearch, FaHome, FaPlus, FaTimes } from "react-icons/fa";

const DARK_BLUE = "#0d2346";

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
  const [searchInput, setSearchInput] = useState("");
  const [newRest, setNewRest] = useState({
    name: "",
    desc: "",
    addr: "",
    img: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  const showSearchBox = location.pathname === "/buscar";
  const showForm = location.pathname === "/nuevo";

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

  useEffect(() => {
    if (!showSearchBox) setSearchInput("");
    if (!showForm) setNewRest({ name: "", desc: "", addr: "", img: "" });
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleInput = e => {
    setNewRest({ ...newRest, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    const tempRest = { ...newRest, id: Date.now().toString() };
    setRestaurants(prev => [tempRest, ...prev]);
    setNewRest({ name: "", desc: "", addr: "", img: "" });
    navigate("/");
    try {
      await addDoc(collection(db, "restaurants"), newRest);
      fetchRestaurants();
    } catch (err) {
      setError("Error al guardar el restaurante.");
    }
  };

  const handleInicio = () => {
    navigate("/");
  };
  const handleBuscar = () => {
    navigate("/buscar");
  };
  const handleNuevo = () => {
    navigate("/nuevo");
  };

  const filtered = showSearchBox
    ? restaurants.filter(r =>
        r.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : restaurants;

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <div className="mb-3 d-flex flex-column gap-2 flex-md-row align-items-center">
        {showSearchBox ? (
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
              className="btn"
              style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
              type="button"
              onClick={handleInicio}
              title="Cerrar búsqueda"
            >
              <FaTimes style={{ marginRight: 6, color: "#fff" }} />
              Cerrar
            </button>
          </div>
        ) : (
          !showForm && (
            <button
              className="btn"
              type="button"
              onClick={handleBuscar}
              style={{ maxWidth: 300, background: DARK_BLUE, color: "#fff", border: "none" }}
            >
              <FaSearch style={{ marginRight: 6, color: "#fff" }} />
              Buscar
            </button>
          )
        )}
        <button
          className="btn ms-md-2 mt-2 mt-md-0"
          onClick={handleInicio}
          type="button"
          style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
        >
          <FaHome style={{ marginRight: 6, color: "#fff" }} />
          Inicio
        </button>
        {!showForm && (
          <button
            className="btn ms-md-2 mt-2 mt-md-0"
            onClick={handleNuevo}
            type="button"
            style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
          >
            <FaPlus style={{ marginRight: 6, color: "#fff" }} />
            Nuevo Restaurante
          </button>
        )}
      </div>

      {showForm ? (
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
          <button
            className="btn"
            type="submit"
            style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
          >
            <FaPlus style={{ marginRight: 6, color: "#fff" }} />
            Guardar
          </button>
          <button
            className="btn ms-2"
            type="button"
            onClick={handleInicio}
            style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
          >
            <FaTimes style={{ marginRight: 6, color: "#fff" }} />
            Cancelar
          </button>
        </form>
      ) : (
        <>
          {/* Título e icono eliminados */}
          <div style={{ height: 24, marginBottom: 16 }}></div>
          <div className="row row-cols-1 row-cols-md-2 g-5">
            {filtered.length === 0 ? (
              <div>No hay restaurantes registrados.</div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r.id + r.name}
                  className="border rounded p-3 mb-4"
                  style={{
                    background: "linear-gradient(135deg, #ccd1d1 0%, #e0e0e0 100%)",
                    color: "#222",
                    minHeight: 200,
                    flexDirection: "row",
                    gap: 45,
                    boxShadow: "0 4px 16px rgba(52, 123, 210, 0.1)",
                    maxWidth: 300,
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
                    <div style={{ fontSize: 14, color: "#444" }}>{r.addr}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          {loading && <div>Cargando restaurantes...</div>}
        </>
      )}
    </div>
  );
}