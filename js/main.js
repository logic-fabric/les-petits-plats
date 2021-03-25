"use strict";

import { RECIPES } from "./data/recipesData.js";
import { DataFetcher } from "./data/dataFetcher.js";
import { PageManager } from "./pages/pageManager.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();

recipesList.sortByName();

const pageManager = new PageManager(recipesList);

pageManager.render();
