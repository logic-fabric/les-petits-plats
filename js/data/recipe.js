"use strict";

import { sortAlphabetically } from "../utilities/sort.js";
import { removeAccents, removeStopWords } from "../utilities/words.js";

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

  get descriptionWithoutAccent() {
    return removeAccents(this.description);
  }

  get ingredientsNamesWithoutAccent() {
    const ingredientsNames = [];

    for (let item of this.ingredients) {
      let ingredientNameWithoutAccent = removeAccents(item.ingredient);

      ingredientsNames.push(ingredientNameWithoutAccent);
    }

    return ingredientsNames;
  }

  get nameWithoutAccent() {
    return removeAccents(this.name);
  }
}

export class RecipesList {
  constructor(recipes) {
    this.recipes = recipes;
    this.sortByName();
  }

  _collectAppliances() {
    const appliances = new Set();

    for (let recipe of this.recipes) {
      appliances.add(
        recipe.appliance[0].toUpperCase() + recipe.appliance.slice(1)
      );
    }

    return [...appliances];
  }

  _collectIngredients() {
    const ingredients = new Set();

    for (let recipe of this.recipes) {
      for (let ingredient of recipe.ingredients) {
        ingredients.add(
          ingredient.ingredient[0].toUpperCase() +
            ingredient.ingredient.slice(1)
        );
      }
    }

    return [...ingredients];
  }

  _collectUstensils() {
    const ustensils = new Set();

    for (let recipe of this.recipes) {
      for (let ustensil of recipe.ustensils) {
        ustensils.add(ustensil.toUpperCase()[0] + ustensil.slice(1));
      }
    }

    return [...ustensils];
  }

  get sortedAppliances() {
    const appliances = this._collectAppliances();

    return sortAlphabetically(appliances);
  }

  get sortedIngredients() {
    const ingredients = this._collectIngredients();

    return sortAlphabetically(ingredients);
  }

  get sortedUstensils() {
    const ustensils = this._collectUstensils();

    return sortAlphabetically(ustensils);
  }

  filterIngredients(userInput) {
    const filteredIngredients = [];

    userInput = userInput.toLowerCase();

    for (let ingredient of this.sortedIngredients) {
      ingredient = ingredient.toLowerCase();

      if (ingredient.search(userInput) > -1) {
        filteredIngredients.push(ingredient);
      }
    }

    return filteredIngredients;
  }

  searchWithSearchBar(userInput) {
    let filteredRecipes = new Set(this.recipes);
    const words = userInput.split(" ");

    const keywords = removeStopWords(words);

    for (let word of keywords) {
      const wordRecipes = new Set();

      for (let recipe of this.recipes) {
        if (
          recipe.nameWithoutAccent.includes(word) ||
          recipe.ingredientsNamesWithoutAccent.includes(word) ||
          recipe.descriptionWithoutAccent.includes(word)
        ) {
          wordRecipes.add(recipe);
        }
      }

      // Intersect wordRecipes with actual filteredRecipes:
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
