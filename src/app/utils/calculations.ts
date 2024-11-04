import { JarFruit } from "../types/types";

interface TotalNutrition {
  calories: number;
  sugar: number;
  fat: number;
}

export const calculateTotalNutrition = (fruits: JarFruit[]): TotalNutrition => {
  return fruits.reduce(
    (acc, fruit) => ({
      calories: acc.calories + fruit.nutritions.calories,
      sugar: acc.sugar + fruit.nutritions.sugar,
      fat: acc.fat + fruit.nutritions.fat,
    }),
    { calories: 0, sugar: 0, fat: 0 }
  );
};

