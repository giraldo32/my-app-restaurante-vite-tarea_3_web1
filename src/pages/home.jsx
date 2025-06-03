import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import "./home.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaHome, FaPlus, FaTimes, FaStar, FaSave } from "react-icons/fa";

const DARK_BLUE = "#0d2346";

// Restaurantes quemados con un campo extra: isBurned: true
const restaurantesIniciales = [
  {
    id: "1",
    name: "La Parrilla del Chef",
    desc: "Especialidad en carnes a la brasa.",
    addr: "Av. Principal 123",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    rating: 4,
    isBurned: true
  },
  {
    id: "2",
    name: "Sabor a México",
    desc: "Auténtica comida mexicana.",
    addr: "Calle 8 #45-67",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    rating: 5,
    isBurned: true
  },
  {
    id: "3",
    name: "Pasta & Basta",
    desc: "Pastas y pizzas artesanales.",
    addr: "Carrera 10 #20-30",
    img: "https://www.unileverfoodsolutions.com.co/dam/global-ufs/mcos/NOLA/calcmenu/recipes/col-recipies/italiana/PASTA%20CON%20POLLO%20TOCINETA%20Y%20BECHAMEL-1200x709.jpg",
    rating: 3,
    isBurned: true
  },
  {
    id: "4",
    name: "El Mar de Sabores",
    desc: "Pescados y mariscos frescos.",
    addr: "Calle del Mar 50",
    img: "https://verestmagazine.com/wp-content/uploads/2023/04/Cuaresma-Bellopuerto-1024x683.jpg",
    rating: 4,
    isBurned: true
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState(restaurantesIniciales);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [newRest, setNewRest] = useState({
    name: "",
    desc: "",
    addr: "",
    img: "",
    rating: ""
  });
  const [userRatings, setUserRatings] = useState({});
  const [showAddInSearch, setShowAddInSearch] = useState(false);
  const [searchRest, setSearchRest] = useState({
    name: "",
    desc: "",
    addr: "",
    img: "",
    rating: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  const showSearchBox = location.pathname === "/buscar";
  const showForm = location.pathname === "/nuevo";

  // Al iniciar, sube los restaurantes quemados a la base de datos si no existen
  const syncBurnedToFirestore = async () => {
    const snapshot = await getDocs(collection(db, "restaurants"));
    const idsFirestore = snapshot.docs.map(doc => doc.id);
    for (const rest of restaurantesIniciales) {
      // Si no existe en Firestore, lo sube con el id fijo
      if (!idsFirestore.includes(rest.id)) {
        await setDoc(doc(db, "restaurants", rest.id), {
          name: rest.name,
          desc: rest.desc,
          addr: rest.addr,
          img: rest.img,
          rating: rest.rating,
          isBurned: true
        });
      }
    }
  };

  const fetchRestaurants = async () => {
    try {
      await syncBurnedToFirestore();
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!showSearchBox) setSearchInput("");
    if (!showForm) setNewRest({ name: "", desc: "", addr: "", img: "", rating: "" });
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleInput = e => {
    setNewRest({ ...newRest, [e.target.name]: e.target.value });
  };

  const handleSearchInput = e => {
    setSearchInput(e.target.value);
  };

  const handleAdd = async e => {
    e.preventDefault();
    setSuccess(null);
    navigate("/");
    try {
      await addDoc(collection(db, "restaurants"), { ...newRest, rating: Number(newRest.rating) || 0 });
      setSuccess("¡Restaurante guardado exitosamente!");
      fetchRestaurants();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al guardar el restaurante.");
    }
    setNewRest({ name: "", desc: "", addr: "", img: "", rating: "" });
  };

  const handleAddFromSearch = async e => {
    e.preventDefault();
    setSuccess(null);
    setShowAddInSearch(false);
    try {
      await addDoc(collection(db, "restaurants"), { ...searchRest, rating: Number(searchRest.rating) || 0 });
      setSuccess("¡Restaurante guardado exitosamente!");
      fetchRestaurants();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al guardar el restaurante.");
    }
    setSearchRest({ name: "", desc: "", addr: "", img: "", rating: "" });
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

  // Calificación por el cliente y guardado en Firestore
  const handleStarClick = async (restId, starIndex) => {
    const newRating = starIndex + 1;
    setUserRatings(prev => ({
      ...prev,
      [restId]: newRating
    }));

    setRestaurants(prev =>
      prev.map(r =>
        r.id === restId ? { ...r, rating: newRating } : r
      )
    );

    // Actualiza en Firestore para cualquier restaurante (quemado o agregado)
    try {
      const restDoc = doc(db, "restaurants", restId);
      await updateDoc(restDoc, { rating: newRating });
      setSuccess("¡Calificación guardada!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError("Error al guardar la calificación.");
    }
  };

  // Filtro por nombre, descripción, dirección o calificación
  const filtered = showSearchBox
    ? restaurants.filter(r => {
        const search = searchInput.toLowerCase();
        return (
          r.name.toLowerCase().includes(search) ||
          (r.desc && r.desc.toLowerCase().includes(search)) ||
          (r.addr && r.addr.toLowerCase().includes(search)) ||
          (r.rating && r.rating.toString().includes(search))
        );
      })
    : restaurants;

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      {success && (
        <div className="alert alert-success text-center" style={{ fontWeight: "bold" }}>
          {success}
        </div>
      )}

      {/* Botones centrados */}
      <div className="mb-3 d-flex flex-wrap justify-content-center gap-2 align-items-center">
        {showSearchBox ? (
          <div className="input-group" style={{ maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Buscar restaurante..." 
              className="form-control"
              value={searchInput}
              onChange={handleSearchInput}
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
            <button
              className="btn ms-2"
              style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
              type="button"
              onClick={() => setShowAddInSearch(true)}
              title="Agregar restaurante"
            >
              <FaPlus style={{ marginRight: 6, color: "#fff" }} />
              Agregar
            </button>
          </div>
        ) : (
          !showForm && (
            <button
              className="btn"
              type="button"
              onClick={handleBuscar}
              style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
            >
              <FaSearch style={{ marginRight: 6, color: "#fff" }} />
              Buscar
            </button>
          )
        )}
        <button
          className="btn"
          onClick={handleInicio}
          type="button"
          style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
        >
          <FaHome style={{ marginRight: 6, color: "#fff" }} />
          Inicio
        </button>
        {!showForm && !showSearchBox && (
          <button
            className="btn"
            onClick={handleNuevo}
            type="button"
            style={{ background: DARK_BLUE, color: "#fff", border: "none" }}
          >
            <FaPlus style={{ marginRight: 6, color: "#fff" }} />
            Nuevo Restaurante
          </button>
        )}
      </div>

      {/* Card para agregar restaurante desde buscar */}
      {showAddInSearch && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div
            className="card shadow"
            style={{
              maxWidth: 420,
              width: "100%",
              padding: 0,
              borderRadius: 18,
              background: "#f8f9fa",
              border: `2px solid ${DARK_BLUE}`,
              boxShadow: "0 8px 32px rgba(13,35,70,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ width: "100%", padding: "32px 32px 16px 32px" }}>
              <h3 style={{ color: DARK_BLUE, textAlign: "center", marginBottom: 24 }}>
                <FaPlus style={{ marginRight: 8, color: DARK_BLUE }} />
                Agregar Restaurante
              </h3>
              <form onSubmit={handleAddFromSearch}>
                <input
                  name="name"
                  placeholder="Nombre"
                  className="form-control mb-3"
                  value={searchRest.name}
                  onChange={e => setSearchRest({ ...searchRest, name: e.target.value })}
                  required
                />
                <input
                  name="desc"
                  placeholder="Descripción"
                  className="form-control mb-3"
                  value={searchRest.desc}
                  onChange={e => setSearchRest({ ...searchRest, desc: e.target.value })}
                  required
                />
                <input
                  name="addr"
                  placeholder="Dirección"
                  className="form-control mb-3"
                  value={searchRest.addr}
                  onChange={e => setSearchRest({ ...searchRest, addr: e.target.value })}
                  required
                />
                <input
                  name="img"
                  placeholder="URL de la imagen"
                  className="form-control mb-3"
                  value={searchRest.img}
                  onChange={e => setSearchRest({ ...searchRest, img: e.target.value })}
                  required
                />
                <input
                  type="number"
                  name="rating"
                  placeholder="Calificación (1-5)"
                  className="form-control mb-3"
                  value={searchRest.rating}
                  onChange={e => setSearchRest({ ...searchRest, rating: e.target.value })}
                  min={1}
                  max={5}
                  required
                />
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn"
                    type="submit"
                    style={{ background: DARK_BLUE, color: "#fff", border: "none", minWidth: 110 }}
                  >
                    <FaSave style={{ marginRight: 6, color: "#fff" }} />
                    Guardar
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setShowAddInSearch(false)}
                    style={{ background: DARK_BLUE, color: "#fff", border: "none", minWidth: 110 }}
                  >
                    <FaTimes style={{ marginRight: 6, color: "#fff" }} />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="card-nuevo-restaurante">
            <div className="card-body">
              <h3>
                <FaPlus style={{ marginRight: 8, color: DARK_BLUE }} />
                Nuevo Restaurante
              </h3>
              <form onSubmit={handleAdd} style={{ width: "100%" }}>
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input
                    name="name"
                    placeholder="Nombre"
                    className="form-control"
                    value={newRest.name}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Descripción</label>
                  <input
                    name="desc"
                    placeholder="Descripción"
                    className="form-control"
                    value={newRest.desc}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Dirección</label>
                  <input
                    name="addr"
                    placeholder="Dirección"
                    className="form-control"
                    value={newRest.addr}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">URL de la imagen</label>
                  <input
                    name="img"
                    placeholder="URL de la imagen"
                    className="form-control"
                    value={newRest.img}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Calificación (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Calificación (1-5)"
                    className="form-control"
                    value={newRest.rating}
                    onChange={handleInput}
                    min={1}
                    max={5}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      background: DARK_BLUE,
                      color: "#fff",
                      border: "none"
                    }}
                  >
                    <FaSave style={{ marginRight: 6, color: "#fff" }} />
                    Guardar
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={handleInicio}
                    style={{
                      background: "#fff",
                      color: DARK_BLUE,
                      border: `2px solid ${DARK_BLUE}`
                    }}
                  >
                    <FaTimes style={{ marginRight: 6, color: DARK_BLUE }} />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
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
                      margin: "0 auto",
                      display: "block"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 22, display: "block", marginBottom: 8 }}>{r.name}</strong>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < (userRatings[r.id] ?? r.rating ?? 0) ? DARK_BLUE : "#ccc"}
                          style={{ marginRight: 2, cursor: "pointer", transition: "color 0.2s" }}
                          onClick={() => handleStarClick(r.id, i)}
                          title={`Calificar con ${i + 1} estrellas`}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: 16, marginBottom: 6, whiteSpace: "pre-line", wordBreak: "break-word" }}>{r.desc}</div>
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