"use strict";

import { RECIPES } from "./data/recipesData.js";
import { DataFetcher } from "./data/dataFetcher.js";
import { PageHandler } from "./pages/pageHandler.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();
const pageManager = new PageHandler(recipesList);

pageManager.render();
