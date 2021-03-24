"use strict";

import { Recipe, RecipesList } from "./recipe.js";

export class DataFetcher {
  constructor(dataSource) {
    this._dataSource = dataSource;
  }

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
