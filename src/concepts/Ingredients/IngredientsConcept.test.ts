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
