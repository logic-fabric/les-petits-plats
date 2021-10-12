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
          recipe.cover,
          recipe.altText,
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

/* ================================
   HASH TABLE FOR SEARCHING RECIPES
   ================================ */

/**
 * @param {Recipe} recipe
 * @returns {Array.string}
 */
function extractKeywordsFromRecipe(recipe) {
  let recipeWords = `${recipe.nameWithoutAccent} ${recipe.joinedIngredientsWithoutAccent} ${recipe.applianceNameWithoutAccent} ${recipe.joinedUstensilsWithoutAccent} ${recipe.descriptionWithoutAccent}`;

  recipeWords = recipeWords.split(" ");

  const recipeKeywords = removeStopWords(recipeWords);

  return recipeKeywords;
}

/**
 * Complete the hash table for a pre-treated recipe.
 * @param {Recipe} recipe
 * @param {Array.string} recipeKeywords
 * @param {Object} hashTable
 * @returns
 */
function addRecipeKeywordsToHashTable(recipe, recipeKeywords, hashTable) {
  for (let keyword of recipeKeywords) {
    for (let i = 1; i <= keyword.length; i++) {
      const troncatedKeyword = keyword.slice(0, i);

      if (troncatedKeyword in hashTable) {
        hashTable[troncatedKeyword].add(recipe);
      } else {
        hashTable[troncatedKeyword] = new Set([recipe]);
      }
    }
  }

  return hashTable;
}

/**
 * Return an object associating all potential matching keyword with the set of recipes containing this keyword.
 * @param {RecipesList} recipesList
 * @returns {Object}
 */
export function buildHashTableForSearchingRecipes(recipesList) {
  let hashTableForSearchingRecipes = {};

  for (let recipe of recipesList.recipes) {
    const recipeKeywords = extractKeywordsFromRecipe(recipe);

    hashTableForSearchingRecipes = addRecipeKeywordsToHashTable(
      recipe,
      recipeKeywords,
      hashTableForSearchingRecipes
    );
  }

  return hashTableForSearchingRecipes;
}
