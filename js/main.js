"use strict";

import { RECIPES } from "./data/recipesData.js";
import {
  DataFetcher,
  buildHashTableForSearchingRecipes,
} from "./data/dataFetcher.js";
import { HomePageBuilder } from "./pages/homePageBuilder.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();
const HASH_TABLE_FOR_SEARCHING_RECIPES = buildHashTableForSearchingRecipes(
  recipesList
);

new HomePageBuilder(recipesList, HASH_TABLE_FOR_SEARCHING_RECIPES).render();
