"use strict";

import {
  capitalizeFirstChar,
  keepOnlyLettersAndRemoveAccents,
  removeStopWords,
  sortAlphabetically,
} from "../utilities/strings.js";

export class Recipe {
  /**
   * @constructs
   * @param {number} id
   * @param {string} name
   * @param {string} cover
   * @param {string} altText
   * @param {number} servings
   * @param {Array.Object} ingredients
   * @param {number} time
   * @param {string} description
   * @param {string} appliance
   * @param {Array.string} ustensils
   */
  constructor(
    id,
    name,
    cover,
    altText,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  ) {
    this.id = id;
    this.name = name;
    this.cover = cover;
    this.altText = altText;
    this.servings = servings;
    this.ingredients = ingredients;
    this.time = time;
    this.description = description;
    this.appliance = appliance;
    this.ustensils = ustensils;
  }

  /**
   * @return {string}
   */
  get applianceNameWithoutAccent() {
    return keepOnlyLettersAndRemoveAccents(this.appliance);
  }

  /**
   * @returns {string}
   */
  get descriptionWithoutAccent() {
    return keepOnlyLettersAndRemoveAccents(this.description);
  }

  /**
   * @returns {string}
   */
  get joinedIngredientsWithoutAccent() {
    const ingredientsList = [];

    for (let item of this.ingredients) {
      ingredientsList.push(keepOnlyLettersAndRemoveAccents(item.ingredient));
    }

    return ingredientsList.join(" ");
  }

  /**
   * @returns {string}
   */
  get nameWithoutAccent() {
    return keepOnlyLettersAndRemoveAccents(this.name);
  }

  /**
   * @returns {string}
   */
  get joinedUstensilsWithoutAccent() {
    const ustensilsList = [];

    for (let ustensil of this.ustensils) {
      ustensilsList.push(keepOnlyLettersAndRemoveAccents(ustensil));
    }

    return ustensilsList.join(" ");
  }
}

export class RecipesList {
  /**
   * @constructs
   * @param {Array.Recipe} recipes
   */
  constructor(recipes) {
    this.recipes = recipes;
    this._sortByName();
  }

  /**
   * @returns {Array.string}
   */
  get sortedAppliances() {
    return sortAlphabetically(this._collectAppliances());
  }

  /**
   * @returns {Array.string}
   */
  get sortedIngredients() {
    return sortAlphabetically(this._collectIngredients());
  }

  /**
   * @returns {Array.string}
   */
  get sortedUstensils() {
    return sortAlphabetically(this._collectUstensils());
  }

  /**
   * Name sorting adapted to french language (accents handling)
   * @returns {Array.string}
   */
  _sortByName() {
    return this.recipes.sort((r1, r2) => {
      const name1 = r1.name.toLowerCase();
      const name2 = r2.name.toLowerCase();

      const [sortedName1, sortedName2] = sortAlphabetically([name1, name2]);

      if (sortedName1 === name2) return 1;
      if (sortedName1 === name1) return -1;
      return 0;
    });
  }

  /**
   * @returns {Array.string}
   */
  _collectAppliances() {
    const appliances = new Set();

    for (let recipe of this.recipes) {
      appliances.add(capitalizeFirstChar(recipe.appliance));
    }

    return [...appliances];
  }

  /**
   * @returns {Array.string}
   */
  _collectIngredients() {
    const ingredients = new Set();

    for (let recipe of this.recipes) {
      for (let item of recipe.ingredients) {
        ingredients.add(capitalizeFirstChar(item.ingredient));
      }
    }

    return [...ingredients];
  }

  /**
   * @returns {Array.string}
   */
  _collectUstensils() {
    const ustensils = new Set();

    for (let recipe of this.recipes) {
      for (let ustensil of recipe.ustensils) {
        ustensils.add(capitalizeFirstChar(ustensil));
      }
    }

    return [...ustensils];
  }

  /**
   * Search recipes corresponding to the input in search bar and active badges.
   * @param {Object} userRequest
   * @param {Object} hashTableForSearchingRecipes
   * @returns {RecipesList}
   */
  search(userRequest, hashTableForSearchingRecipes) {
    userRequest = `${userRequest.userInput} ${userRequest.joinedBadges}`;

    const words = userRequest.split(" ");
    const keywords = removeStopWords(words);

    let filteredRecipes = new Set(this.recipes);

    for (let keyword of keywords) {
      // get all recipes containing this keyword:
      keyword = keepOnlyLettersAndRemoveAccents(keyword);

      const keywordRecipes =
        keyword in hashTableForSearchingRecipes
          ? hashTableForSearchingRecipes[keyword]
          : new Set();

      // intersect keywordRecipes with actual filteredRecipes:
      filteredRecipes = new Set(
        [...keywordRecipes].filter((recipe) => filteredRecipes.has(recipe))
      );
    }

    return new RecipesList([...filteredRecipes]);
  }
}
