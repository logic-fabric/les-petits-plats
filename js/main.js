"use strict";

import { RECIPES } from "./data/recipesData.js";
import { DataFetcher } from "./data/dataFetcher.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();

for (let recipe of recipesList.recipes) {
  console.log(recipe.name);
}
