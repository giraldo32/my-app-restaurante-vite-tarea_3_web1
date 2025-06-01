import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'restaurants';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9); 
};

export const getRestaurants = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const restaurants = [];
    
    querySnapshot.forEach((doc) => {
      restaurants.push({
        id: doc.id,
        ...doc.data()
      });
    });

    if (restaurants.length === 0) {
      const initialRestaurants = await initializeRestaurants();
      return initialRestaurants;
    }

    return restaurants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error al obtener restaurantes:', error);
    throw error;
  }
};


export const getRestaurantById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al buscar restaurante:', error);
    throw error;
  }
};

export const searchRestaurantsByName = async (searchTerm) => {
  try {
    const restaurants = await getRestaurants();
    
    if (!searchTerm) {
      return restaurants;
    }

    // Filtrar por nombre (búsqueda insensible a mayúsculas/minúsculas)
    const filteredRestaurants = restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredRestaurants;
  } catch (error) {
    console.error('Error al buscar restaurantes:', error);
    throw error;
  }
};


export const addRestaurant = async (restaurantData) => {
  try {
    const newRestaurant = {
      ...restaurantData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newRestaurant);
    
    return {
      id: docRef.id,
      ...newRestaurant
    };
  } catch (error) {
    console.error('Error al añadir restaurante:', error);
    throw error;
  }
};

export const updateRestaurant = async (id, updatedData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const updateData = {
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // Retornar el restaurante actualizado
    const updatedRestaurant = await getRestaurantById(id);
    return updatedRestaurant;
  } catch (error) {
    console.error('Error al actualizar restaurante:', error);
    throw error;
  }
};

export const deleteRestaurant = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error al eliminar restaurante:', error);
    throw error;
  }
};


export const getRestaurantsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const restaurants = [];
    
    querySnapshot.forEach((doc) => {
      restaurants.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return restaurants;
  } catch (error) {
    console.error('Error al filtrar por categoría:', error);
    throw error;
  }
};


const initializeRestaurants = async () => {
  try {
    const initialRestaurants = getInitialRestaurants();
    const batch = writeBatch(db);
    const addedRestaurants = [];

    initialRestaurants.forEach((restaurant) => {
      const docRef = doc(collection(db, COLLECTION_NAME));
      batch.set(docRef, restaurant);
      addedRestaurants.push({
        id: docRef.id,
        ...restaurant
      });
    });

    await batch.commit();
    
    console.log('Restaurantes inicializados correctamente');
    return addedRestaurants;
  } catch (error) {
    console.error('Error al inicializar restaurantes:', error);
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


