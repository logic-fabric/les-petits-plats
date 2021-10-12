"use strict";

import { RECIPES } from "./data/recipesData.js";
import {
  DataFetcher,
  buildHashTableForSearchingRecipes,
} from "./data/dataFetcher.js";
import { HomePageBuilder } from "./pages/homePageBuilder.js";

const dataFetcher = new DataFetcher(RECIPES);
const recipesList = dataFetcher.getRecipesList();
const HASH_TABLE_FOR_SEARCHING_RECIPES =
  buildHashTableForSearchingRecipes(recipesList);

//console.log(HASH_TABLE_FOR_SEARCHING_RECIPES);

new HomePageBuilder(recipesList, HASH_TABLE_FOR_SEARCHING_RECIPES).render();

// SEARCH ALGORITHM PERFORMANCE:
measureAlgorithmPerformance();

function measureAlgorithmPerformance() {
  // with a request corresponding to 4 recipes:
  const TEST_USER_REQUEST_1 = {
    userInput: "choco",
    joinedBadges: "sucre beurre",
  };
  // with a request corresponding to no recipe:
  const TEST_USER_REQUEST_2 = {
    userInput: "choco",
    joinedBadges: "maïs basilic",
  };
  const TESTS_QUANTITY = 1_000;

  const testStarting = Date.now();

  let searchResult1, searchResult2;

  for (let _ = 0; _ < TESTS_QUANTITY; _++) {
    searchResult1 = recipesList.search(
      TEST_USER_REQUEST_1,
      HASH_TABLE_FOR_SEARCHING_RECIPES
    );
    searchResult2 = recipesList.search(
      TEST_USER_REQUEST_2,
      HASH_TABLE_FOR_SEARCHING_RECIPES
    );
  }

  const testEnding = Date.now();

  const testDuration = testEnding - testStarting;

  /* console.log(
    `${2 * TESTS_QUANTITY} recherches réalisées en ${testDuration} ms`
  ); */
}
