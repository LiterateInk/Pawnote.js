import { type Meal, DishKind, UnreachableError } from "~/models";
import { decodeFood } from "./food";

/**
 * Decode a meal from the server response.
 * @param meal - The meal data from the server.
 * @returns The decoded meal object.
 */
export const decodeMeal = (meal: any): Meal => {
  const dishes = meal.ListePlats.V.reduce((acc: any, dish: any) => {
    let key: string;

    switch (dish.G) {
      case DishKind.Entry:
        key = "entry";
        break;
      case DishKind.Main:
        key = "main";
        break;
      case DishKind.Side:
        key = "side";
        break;
      case DishKind.Drink:
        key = "drink";
        break;
      case DishKind.Fromage:
        key = "fromage";
        break;
      case DishKind.Dessert:
        key = "dessert";
        break;
      default:
        throw new UnreachableError("decodeMeal");
    }

    acc[key] = dish.ListeAliments.V.map(decodeFood);
    return acc;
  }, {});

  return {
    name: meal.L,
    ...dishes
  };
};
