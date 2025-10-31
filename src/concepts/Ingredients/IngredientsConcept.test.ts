import { assert } from "jsr:@std/assert/assert";
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { Ingredient } from "./IngredientsConcept.ts";
import IngredientsConcept from "./IngredientsConcept.ts";
import { testDb } from "@utils/database.ts";

Deno.test("Operational principle: upload ingredients and collate them", async () => {
  console.log("\n🧪 TEST CASE 1: Operational principle, simple");
  console.log("==================================");
  const [db, client] = await testDb();
  try {
    const ingredientsConcept = new IngredientsConcept(db);

    const date = "2025-10-31";
    await ingredientsConcept.addDate({ date: date });

    const item = "salt";
    const quantity = 5;
    const unit = "tbsp";

    await ingredientsConcept.addIngredient({
      date: date,
      item: item,
      quantity: quantity,
      unit: unit,
    });

    const shoppingList = await ingredientsConcept._getShoppingList({
      dates: [date],
    }) as Array<
      { ingredient: { item: string; quantity: number; unit: string } }
    >;

    assertEquals(shoppingList.length, 1);

    assertEquals(shoppingList[0].ingredient.item, item);
    assertEquals(shoppingList[0].ingredient.quantity, quantity);
    assertEquals(shoppingList[0].ingredient.unit, unit);
  } finally {
    await client.close();
  }
});

Deno.test("Operational principle: upload ingredients and collate them", async () => {
  console.log("\n🧪 TEST CASE 2: Operational principle, more complex");
  console.log("==================================");
  const [db, client] = await testDb();
  try {
    const ingredientsConcept = new IngredientsConcept(db);

    const date1 = "2025-10-31";
    await ingredientsConcept.addDate({ date: date1 });

    const date2 = "2025-11-3";
    await ingredientsConcept.addDate({ date: date2 });

    const ingredient1 = {
      date: date1,
      item: "salt",
      quantity: 5,
      unit: "tbsp",
    };

    const ingredient2 = {
      date: date1,
      item: "pepper",
      quantity: 4,
      unit: "tbsp",
    };
    const ingredient3 = {
      date: date2,
      item: "salt",
      quantity: 30,
      unit: "tbsp",
    };

    await ingredientsConcept.addIngredient(ingredient1);
    await ingredientsConcept.addIngredient(ingredient2);
    await ingredientsConcept.addIngredient(ingredient3);

    const shoppingList = await ingredientsConcept._getShoppingList({
      dates: [date1, date2],
    }) as Array<
      { ingredient: { item: string; quantity: number; unit: string } }
    >;

    assertEquals(shoppingList.length, 2);
  } finally {
    await client.close();
  }
});
