"use strict";

import { RECIPES } from "./data/recipesData.js";
import { DataFetcher } from "./data/dataFetcher.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();

recipesList.sortByName();

console.log("--- INGREDIENTS ---");

for (let ingredient of recipesList.sortedIngredients) {
  console.log(ingredient);
}

console.log("--- APPLIANCES ---");

for (let appliance of recipesList.sortedAppliances) {
  console.log(appliance);
}

console.log("--- USTENSILS ---");

for (let ustensil of recipesList.sortedUstensils) {
  console.log(ustensil);
}
