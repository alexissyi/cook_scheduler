**concept** Ingredients

**purpose** to track ingredients for each day and generate shopping lists

**principle** users can upload ingredients to each day; after, foodstuds can collate all ingredients lists in one week into one gigantic list

**state**

a set of Date Dates

a set of Ingredient Ingredients with
 
&ensp; a Date 

&ensp; an Item

&ensp; a number Quantity

&ensp; a Unit


**invariants**

any Date for an Ingredient is in Dates

**actions**

addDate(date: Date) 

**requires** nothing

**effect** adds date to Dates if it's not already there

removeDate(date: Date)

**requires** nothing

**effect** removes date from Dates if it exists there and removes all Ingredients with date

addIngredient(date: Date, item: Item, quantity: number, unit: Unit): Ingredient

**requires** date is in Dates

**effect** creates a new Ingredient with date, item, quantity and unit, adds it to Ingredients and returns it

removeIngredient(ingredient: Ingredient)

**requires** ingredient is in Ingredients

**effect** removes ingredient from Ingredients

**queries**

_getIngredients(date: Date): Array of Ingredient

**requires** date is in Daates

**effect** returns all Ingredients associated with date, uncollated

_getShoppingList(dates: Array of Date): Array of Ingredient

**requires** all Dates in dates are in Dates

**effect** adds all Ingredients associated with a Date in Dates into an array; ingredients with the same Item and Unit are all summed into one new Ingredient 