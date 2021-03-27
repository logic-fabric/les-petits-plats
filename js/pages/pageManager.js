"use strict";

import { RecipeCard } from "./components/cards.js";

export class PageManager {
  constructor(recipesList) {
    this._recipesList = recipesList;
  }

  render() {
    this._renderBadges();
    this._renderDropdownOptions();
    this._renderCards();
  }

  _renderBadges() {}

  _renderDropdownOptions() {
    const ingredientsList = document.getElementById("ingredients-list");
    const ingredients = this._recipesList.sortedIngredients;
    const numberOfIngredients = ingredients.length;

    ingredientsList.style.height = `${
      Math.ceil(numberOfIngredients / 5) * 40 - 16
    }px`;

    let htmlContent = "";

    for (let ingredient of ingredients) {
      htmlContent += `<li>${ingredient}</li>`;
    }

    ingredientsList.innerHTML = htmlContent;
  }

  _renderCards() {
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let recipe of this._recipesList.recipes) {
      htmlContent += new RecipeCard(recipe).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }
}
