import { Fruit, FruitNutrition } from "../types/types";

const validateNutrition = (nutrition: unknown): nutrition is FruitNutrition => {
  if (!nutrition || typeof nutrition !== 'object') return false;
  
  const n = nutrition as FruitNutrition;
  return (
    typeof n.calories === 'number' &&
    typeof n.fat === 'number' &&
    typeof n.sugar === 'number' &&
    typeof n.carbohydrates === 'number' &&
    typeof n.protein === 'number'
  );
};

export const validateFruit = (fruit: unknown): fruit is Fruit => {
  if (!fruit || typeof fruit !== 'object') return false;
  
  const f = fruit as Fruit;
  return (
    typeof f.id === 'number' &&
    typeof f.name === 'string' &&
    typeof f.family === 'string' &&
    typeof f.order === 'string' &&
    typeof f.genus === 'string' &&
    validateNutrition(f.nutritions)
  );
};

export const validateFruitArray = (data: unknown): data is Fruit[] => {
  if (!Array.isArray(data)) return false;
  return data.every(item => validateFruit(item));
};
