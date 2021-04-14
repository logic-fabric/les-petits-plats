"use strict";

import {
  capitalizeFirstChar,
  removeAccents,
  removeStopWords,
  sortAlphabetically,
} from "../utilities/strings.js";

export class Recipe {
  constructor(
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  ) {
    this.id = id;
    this.name = name;
    this.servings = servings;
    this.ingredients = ingredients;
    this.time = time;
    this.description = description;
    this.appliance = appliance;
    this.ustensils = ustensils;
  }

  get applianceNameWithoutAccent() {
    return removeAccents(this.appliance);
  }

  get descriptionWithoutAccent() {
    return removeAccents(this.description);
  }

  get joinedIngredientsWithoutAccent() {
    const ingredientsList = [];

    for (let item of this.ingredients) {
      ingredientsList.push(removeAccents(item.ingredient));
    }

    return ingredientsList.join(" ");
  }

  get nameWithoutAccent() {
    return removeAccents(this.name);
  }

  get joinedUstensilsWithoutAccent() {
    const ustensilsList = [];

    for (let ustensil of this.ustensils) {
      ustensilsList.push(removeAccents(ustensil));
    }

    return ustensilsList.join(" ");
  }
}

export class RecipesList {
  constructor(recipes) {
    this.recipes = recipes;
    this._sortByName();
  }

  get sortedAppliances() {
    return sortAlphabetically(this._collectAppliances());
  }

  get sortedIngredients() {
    return sortAlphabetically(this._collectIngredients());
  }

  get sortedUstensils() {
    return sortAlphabetically(this._collectUstensils());
  }

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

  _collectAppliances() {
    const appliances = new Set();

    for (let recipe of this.recipes) {
      appliances.add(capitalizeFirstChar(recipe.appliance));
    }

    return [...appliances];
  }

  _collectIngredients() {
    const ingredients = new Set();

    for (let recipe of this.recipes) {
      for (let item of recipe.ingredients) {
        ingredients.add(capitalizeFirstChar(item.ingredient));
      }
    }

    return [...ingredients];
  }

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
   * @param {Array.string} userRequest - [search bar input, joined badges]
   * @returns {RecipesList}
   */
  search(userRequest) {
    console.log("Search recipes for", userRequest);

    userRequest = `${userRequest.userInput} ${userRequest.joinedBadges}`;

    let filteredRecipes = new Set(this.recipes);

    const words = userRequest.split(" ");
    const keywords = removeStopWords(words);

    for (let keyword of keywords) {
      // find all recipes containing this keyword:
      const keywordRecipes = new Set();

      keyword = removeAccents(keyword);

      for (let recipe of this.recipes) {
        if (
          recipe.nameWithoutAccent.includes(keyword) ||
          recipe.joinedIngredientsWithoutAccent.includes(keyword) ||
          recipe.applianceNameWithoutAccent.includes(keyword) ||
          recipe.joinedUstensilsWithoutAccent.includes(keyword) ||
          recipe.descriptionWithoutAccent.includes(keyword)
        ) {
          keywordRecipes.add(recipe);
        }
      }

      // intersect keywordRecipes with actual filteredRecipes:
      filteredRecipes = new Set(
        [...keywordRecipes].filter((recipe) => filteredRecipes.has(recipe))
      );
    }

    return new RecipesList([...filteredRecipes]);
  }
}
