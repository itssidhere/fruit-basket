export interface FruitNutrition {
  calories: number;
  fat: number;
  sugar: number;
  carbohydrates: number;
  protein: number;
}

export interface Fruit {
  id: number;
  name: string;
  family: string;
  order: string;
  genus: string;
  nutritions: FruitNutrition;
}

export type GroupByOption = 'None' | 'Family' | 'Order' | 'Genus';

export interface JarFruit extends Fruit {
  jarId: string; // Unique ID for each fruit in jar
}
