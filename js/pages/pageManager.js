"use strict";

import { RecipeCard } from "./components/cards.js";

export class PageManager {
  constructor(recipesList) {
    this._recipesList = recipesList;
  }

  render() {
    this._renderBadges();
    //this._renderDropdownOptions(this._recipesList.sortedIngredients);
    this._renderCards(this._recipesList);

    this._addSearchBarEvent();
  }

  _renderBadges() {}

  _renderDropdownOptions(ingredients) {
    const ingredientsList = document.getElementById("ingredients-list");
    const numberOfIngredients = ingredients.length;

    ingredientsList.style.width = `${Math.min(numberOfIngredients, 5) * 12}rem`;
    ingredientsList.style.height = `${
      Math.ceil(numberOfIngredients / 5) * 38.5 + 16
    }px`;

    let htmlContent = "";

    for (let ingredient of ingredients) {
      htmlContent += `<li>${ingredient}</li>`;
    }

    ingredientsList.innerHTML = htmlContent;
  }

  _renderCards(recipesList) {
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let recipe of recipesList.recipes) {
      htmlContent += new RecipeCard(recipe).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }

  _addSearchBarEvent() {
    const searchBarInput = document.getElementById("search-bar-input");

    searchBarInput.oninput = () => {
      const userInput = searchBarInput.value;

      const recipesListToDisplay =
        userInput.length < 3
          ? this._recipesList
          : this._recipesList.searchByUserInput(userInput);

      this._renderCards(recipesListToDisplay);
    };
  }
}
