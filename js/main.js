"use strict";

import { RECIPES } from "./data/recipesData.js";
import { DataFetcher } from "./data/dataFetcher.js";
import { HomePageBuilder } from "./pages/homePageBuilder.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();

new HomePageBuilder(recipesList).render();
