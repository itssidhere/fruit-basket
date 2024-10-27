import { fruitData } from '../mocks/fruitData';
import { Fruit } from '../types/types';


export const fetchFruits = async (): Promise<Fruit[]> => {
  // get this https://wcz3qr33kmjvzotdqt65efniv40kokon.lambda-url.us-east-2.on.aws/
  const response = await fetch('https://wcz3qr33kmjvzotdqt65efniv40kokon.lambda-url.us-east-2.on.aws/');
  const data = await response.json();
  return data;
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fruitData);
    }, 500);
  });
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
