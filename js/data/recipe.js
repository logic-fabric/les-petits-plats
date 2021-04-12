"use strict";

import { sortAlphabetically } from "../utilities/sort.js";
import {
  capitalizeFirstChar,
  removeAccents,
  removeStopWords,
} from "../utilities/words.js";

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

  get ingredientsListWithoutAccent() {
    const ingredientsList = [];

    for (let item of this.ingredients) {
      ingredientsList.push(removeAccents(item.ingredient));
    }

    return ingredientsList;
  }

  get nameWithoutAccent() {
    return removeAccents(this.name);
  }

  get ustensilsListWithoutAccent() {
    const ustensilsList = [];

    for (let ustensil of this.ustensils) {
      ustensilsList.push(removeAccents(ustensil));
    }

    return ustensilsList;
  }
}

export class RecipesList {
  constructor(recipes) {
    this.recipes = recipes;
    this.sortByName();
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
   * @param {string} userRequest 
   * @returns {RecipesList}
   */
  search(userRequest) {
    if (userRequest.length < 3) {
      return this;
    }

    let filteredRecipes = new Set(this.recipes);
    const words = userRequest.split(" ");
    const keywords = removeStopWords(words);

    console.log(`Search recipes for "${userRequest}"`);

    for (let word of keywords) {
      const wordRecipes = new Set();

      word = removeAccents(word);

      for (let recipe of this.recipes) {
        if (
          recipe.nameWithoutAccent.includes(word) ||
          recipe.ingredientsListWithoutAccent.includes(word) ||
          recipe.applianceNameWithoutAccent.includes(word) ||
          recipe.ustensilsListWithoutAccent.includes(word) ||
          recipe.descriptionWithoutAccent.includes(word)
        ) {
          wordRecipes.add(recipe);
        }
      }

      // intersect wordRecipes with actual filteredRecipes:
      filteredRecipes = new Set(
        [...wordRecipes].filter((recipe) => filteredRecipes.has(recipe))
      );
    }

    return new RecipesList([...filteredRecipes]);
  }

  sortByName() {
    return this.recipes.sort((r1, r2) => {
      const name1 = r1.name.toLowerCase();
      const name2 = r2.name.toLowerCase();

      if (name1 > name2) return 1;
      if (name1 < name2) return -1;
      return 0;
    });
  }
}
