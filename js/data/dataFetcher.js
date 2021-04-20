"use strict";

import { removeStopWords } from "../utilities/strings.js";
import { Recipe, RecipesList } from "./recipe.js";

export class DataFetcher {
  /**
   * @constructs
   * @param {Array.Object} dataSource
   */
  constructor(dataSource) {
    this._dataSource = dataSource;
  }

  /**
   * @returns {RecipesList}
   */
  getRecipesList() {
    const recipes = [];

    for (let recipe of this._dataSource) {
      recipes.push(
        new Recipe(
          recipe.id,
          recipe.name,
          recipe.servings,
          recipe.ingredients,
          recipe.time,
          recipe.description,
          recipe.appliance,
          recipe.ustensils
        )
      );
    }

    return new RecipesList(recipes);
  }
}

/**
 * Return an object associating all potential matching keyword with the set of recipes containing this keyword.
 * @param {RecipesList} recipesList
 * @returns {Object}
 */
export function buildHashTableForSearchingRecipes(recipesList) {
  const hashTableForSearchingRecipes = {};

  for (let recipe of recipesList.recipes) {
    let recipeWords = `${recipe.nameWithoutAccent} ${recipe.joinedIngredientsWithoutAccent} ${recipe.applianceNameWithoutAccent} ${recipe.joinedUstensilsWithoutAccent} ${recipe.descriptionWithoutAccent}`;

    recipeWords = recipeWords.split(" ");

    const recipeKeywords = removeStopWords(recipeWords);

    for (let keyword of recipeKeywords) {
      for (let i = 1; i <= keyword.length; i++) {
        const troncatedKeyword = keyword.slice(0, i);

        if (troncatedKeyword in hashTableForSearchingRecipes) {
          hashTableForSearchingRecipes[troncatedKeyword].add(recipe);
        } else {
          hashTableForSearchingRecipes[troncatedKeyword] = new Set([recipe]);
        }
      }
    }
  }

  return hashTableForSearchingRecipes;
}
