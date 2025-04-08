import type { Food } from "~/models";
import { decodeFoodAllergen } from "./food-allergen";
import { decodeFoodLabel } from "./food-label";

/**
 * Decode a food from the server response.
 * @param {*} food - The food data from the server.
 * @returns {Food} The decoded food object.
 */
export const decodeFood = (food: any): Food => {
  return {
    name: food.L,
    allergens: food.listeAllergenesAlimentaire.V.map(decodeFoodAllergen),
    labels: food.listeLabelsAlimentaires.V.map(decodeFoodLabel)
  };
};
