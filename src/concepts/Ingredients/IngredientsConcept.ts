import { Empty, ID } from "@utils/types.ts";
import { assert } from "jsr:@std/assert/assert";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { Collection, Db } from "npm:mongodb";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Ingredients" + ".";

export type Ingredient = ID;
/**
 * State: A set of Ingredient with a date, item, quantity, unit
 */
interface IngredientDoc {
  _id: Ingredient;
  date: string; //YYYY-MM-DD format
  item: string;
  quantity: number;
  unit: string;
}

/**
 * State: A set of Dates
 */
interface DateDoc {
  _id: ID;
  date: string; //YYYY-MM-DD format
}

/**
 * @concept Ingredients
 * @purpose to track ingredients for each day and collate them into shopping lists
 */
export default class IngredientsConcept {
  private dates: Collection<DateDoc>; //YYYY-MM-DD format
  private ingredients: Collection<IngredientDoc>;

  constructor(private readonly db: Db) {
    this.dates = this.db.collection(PREFIX + "Dates");
    this.ingredients = this.db.collection(PREFIX + "Ingredients");
  }

  async addDate(
    { date }: { date: string },
  ): Promise<Empty | { error: string }> {
    const matchingDate = await this.dates.findOne({ date: date });
    if (!matchingDate) {
      await this.dates.insertOne({ _id: freshID(), date: date });
    }
    return {};
  }
  async removeDate(
    { date }: { date: string },
  ): Promise<Empty | { error: string }> {
    await this.dates.deleteOne({ date: date });
    return {};
  }
  async addIngredient(
    { date, item, quantity, unit }: {
      date: string;
      item: string;
      quantity: number;
      unit: string;
    },
  ): Promise<{ ingredient: Ingredient } | { error: string }> {
    const ingredientID = freshID() as Ingredient;
    const ingredientDoc = {
      _id: ingredientID,
      date: date,
      item: item,
      quantity: quantity,
      unit: unit,
    };
    await this.ingredients.insertOne(ingredientDoc);
    return { ingredient: ingredientID };
  }
  async removeIngredient(
    { ingredient }: { ingredient: Ingredient },
  ): Promise<Empty | { error: string }> {
    await this.ingredients.deleteOne({ _id: ingredient });
    return {};
  }

  async _getIngredients(
    { date }: { date: string },
  ): Promise<
    Array<{ item: string; quantity: number; unit: string }> | { error: string }
  > {
    const matchingDate = await this.dates.findOne({ date: date });
    assertExists(matchingDate, "Date is not registered");
    const ingredients = await this.ingredients.find({ date: date }).toArray();
    const output: Array<{ item: string; quantity: number; unit: string }> = [];
    ingredients.forEach((ingredient) => {
      output.push({
        item: ingredient.item,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      });
    });
    return output;
  }
  async _getShoppingList(
    { dates }: { dates: Array<string> },
  ): Promise<
    Array<{ ingredient: { item: string; quantity: number; unit: string } }> | {
      error: string;
    }
  > {
    for (const date of dates) {
      const matchingDate = await this.dates.findOne({ date: date });
      assertExists(matchingDate, "Date is not registered");
    }

    const ingredientMap: Map<string, Map<string, number>> = new Map(); // item -> unit -> quantity

    for (const date of dates) {
      const ingredients = await this.ingredients.find({ date: date }).toArray();
      ingredients.forEach((ingredient) => {
        const { item, unit, quantity, date } = ingredient;
        const itemMap = ingredientMap.get(item);
        if (itemMap) {
          const oldQuantity = itemMap.get(unit);
          assertExists(oldQuantity);
          itemMap.set(unit, oldQuantity + quantity);
        } else {
          const newItemMap: Map<string, number> = new Map();
          newItemMap.set(unit, quantity);
          ingredientMap.set(item, newItemMap);
        }
      });
    }
    const output: Array<
      { ingredient: { item: string; quantity: number; unit: string } }
    > = [];

    for (const item of ingredientMap.keys()) {
      const itemMap = ingredientMap.get(item);
      assertExists(itemMap);
      for (const unit of itemMap.keys()) {
        const quantity = itemMap.get(unit);
        assertExists(quantity);
        output.push({
          ingredient: { item: item, quantity: quantity, unit: unit },
        });
      }
    }
    return output;
  }
}
