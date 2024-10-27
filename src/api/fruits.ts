import toast from 'react-hot-toast';
import { fruitData } from '../mocks/fruitData';
import { Fruit } from '../types/types';
import { validateFruitArray } from '../utils/validation';

export const fetchFruits = async (): Promise<Fruit[]> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!validateFruitArray(data)) {
      throw new Error('Invalid data format received from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching fruits:', error);
    toast.error('Failed to fetch fruits. Using fallback data.');
    return fruitData;
  }
};

// Additional helper functions
export const getFruitById = async (id: number): Promise<Fruit | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fruit = fruitData.find(f => f.id === id);
      resolve(fruit);
    }, 200);
  });
};

export const searchFruits = async (query: string): Promise<Fruit[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = fruitData.filter(fruit => 
        fruit.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 300);
  });
};
