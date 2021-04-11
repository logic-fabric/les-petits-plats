"use strict";

import { RecipeCard } from "./components/cards.js";

const FILTERS = ["ingredient", "appliance", "ustensil"];

export class PageHandler {
  constructor(recipesList) {
    this._recipesList = recipesList;
  }

  render() {
    this._renderBadges();
    //this._renderDropdownOptions(this._recipesList.sortedIngredients);
    this._renderCards(this._recipesList);

    this._addSearchBarEvent();
    this._addOpenFilters();
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
          : this._recipesList.searchWithSearchBar(userInput);

      this._renderCards(recipesListToDisplay);
    };
  }

  _closeAllFiltersExceptClicked(clickedFilter) {
    for (let filter of FILTERS) {
      if (filter !== clickedFilter) {
        const filterLabel = document.getElementById(`${filter}-filter-label`);
        const filterIcon = document.getElementById(`${filter}-filter-icon`);
        const itemsList = document.getElementById(`${filter}-list`);

        filterLabel.classList.remove("closed");
        filterIcon.classList.add("fa-chevton-down");
        filterIcon.classList.remove("fa-chevron-up");
        itemsList.classList.remove("opened");
      }
    }
  }

  _addOpenFilters() {
    for (let filter of FILTERS) {
      const filterLabel = document.getElementById(`${filter}-filter-label`);
      const filterIcon = document.getElementById(`${filter}-filter-icon`);
      const itemsList = document.getElementById(`${filter}-list`);

      filterLabel.onclick = (e) => {
        e.preventDefault();

        this._closeAllFiltersExceptClicked(filter);

        filterLabel.classList.toggle("closed");
        filterIcon.classList.toggle("fa-chevton-down");
        filterIcon.classList.toggle("fa-chevron-up");
        itemsList.classList.toggle("opened");
      };

      const filterInput = document.getElementById(`${filter}`);

      filterInput.onclick = (e) => {
        e.stopPropagation();
      };
    }
  }
}
