// Servicio para manejar operaciones relacionadas con restaurantes

// Función que nos permite generar ID únicos
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);  
};

// Obtenemos restaurantes desde el localStorage
export const getRestaurants = async () => { 
  try {
    const savedRestaurants = localStorage.getItem('restaurants');
    if (savedRestaurants) {
      return JSON.parse(savedRestaurants);
    }
    // Si no hay restaurantes en localStorage, inicializar con datos de ejemplo
    const initialRestaurants = getInitialRestaurants();
    localStorage.setItem('restaurants', JSON.stringify(initialRestaurants));
    return initialRestaurants;
  } catch (error) {
    console.error('Error al obtener restaurantes:', error);
    return [];
  }
};

// Listar un restaurante por ID
export const getRestaurantById = async (id) => {   
  try {
    const restaurants = await getRestaurants();
    return restaurants.find(restaurant => restaurant.id === id) || null;  
  } catch (error) {
    console.error('Error al buscar restaurante:', error);
    return null;
  }
};


// Crea un nuevo restaurante
export const addRestaurant = async (restaurantData) => {
  try {
    const restaurants = await getRestaurants();
    const newRestaurant = {
      ...restaurantData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    restaurants.push(newRestaurant);
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    return newRestaurant;
  } catch (error) {
    console.error('Error al añadir restaurante:', error);
    throw error;
  }
};

// Actualiza un restaurate existente
export const updateRestaurant = async (id, updatedData) => {
  try {
    const restaurants = await getRestaurants();
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    
    if (index === -1) {
      throw new Error('Restaurante no encontrado');
    }
    
    const updatedRestaurant = {
      ...restaurants[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    restaurants[index] = updatedRestaurant;
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    return updatedRestaurant;
  } catch (error) {
    console.error('Error al actualizar restaurante:', error);
    throw error;
  }
};

// Eliminar un restaurante
export const deleteRestaurant = async (id) => {
  try {
    const restaurants = await getRestaurants();
    const filteredRestaurants = restaurants.filter(restaurant => restaurant.id !== id);
    
    localStorage.setItem('restaurants', JSON.stringify(filteredRestaurants));
    return true;
  } catch (error) {
    console.error('Error al eliminar restaurante:', error);
    throw error;
  }
};

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




