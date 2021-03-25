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

  _renderDropdownOptions() {}

  _renderCards() {
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let recipe of this._recipesList.recipes) {
      htmlContent += new RecipeCard(recipe).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }
}
