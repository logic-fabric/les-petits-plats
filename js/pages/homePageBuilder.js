"use strict";

import { RecipeCard } from "./components/cards.js";

const FILTERS = ["ingredient", "appliance", "ustensil"];

export class HomePageBuilder {
  constructor(recipesList) {
    this._recipesList = recipesList;
  }

  render() {
    this._renderBadges();
    this._renderFiltersOptions(this._recipesList);
    this._renderCards(this._recipesList);

    this._addSearchBarEvents();
    this._addOpenFiltersEvents();
    this._addCloseAllFiltersEvent();
    this._addSearchWithFiltersEvents();
  }

  _renderBadges() {}

  _renderFiltersOptions(recipesList) {
    const items = {
      ingredient: recipesList.sortedIngredients,
      appliance: recipesList.sortedAppliances,
      ustensil: recipesList.sortedAppliances,
    };

    for (let filter of FILTERS) {
      const itemsList = document.getElementById(`${filter}-list`);
      const itemsQuantity = itemsList.length;

      let htmlContent = "";

      for (let item of items[filter]) {
        htmlContent += `<li>${item}</li>`;
      }

      itemsList.innerHTML = htmlContent;
    }
  }

  _renderCards(recipesList) {
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let recipe of recipesList.recipes) {
      htmlContent += new RecipeCard(recipe).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }

  _addSearchBarEvents() {
    const searchBar = document.querySelector(".p-search-bar");
    const searchBarInput = document.getElementById("search-bar-input");

    searchBar.onclick = (e) => e.stopPropagation();

    searchBarInput.oninput = (e) => {
      const userInput = searchBarInput.value;

      const recipesListToDisplay =
        userInput.length < 3
          ? this._recipesList
          : this._recipesList.searchWithSearchBar(userInput);

      this._renderCards(recipesListToDisplay);
      this._renderFiltersOptions(recipesListToDisplay);
    };
  }

  _closeAllFiltersExceptClicked(clickedFilter) {
    for (let filter of FILTERS) {
      if (filter !== clickedFilter) {
        const filterLabel = document.getElementById(`${filter}-filter-label`);
        const filterIcon = document.getElementById(`${filter}-filter-icon`);
        const itemsList = document.getElementById(`${filter}-list`);

        filterLabel.classList.remove("clicked");
        filterIcon.classList.add("fa-chevton-down");
        filterIcon.classList.remove("fa-chevron-up");
        itemsList.classList.add("closed");
      }
    }
  }

  _addCloseAllFiltersEvent() {
    const body = document.querySelector("body");

    body.onclick = () => {
      this._closeAllFiltersExceptClicked("no filter clicked");
    };
  }

  _addOpenFiltersEvents() {
    for (let filter of FILTERS) {
      const filterLabel = document.getElementById(`${filter}-filter-label`);
      const filterIcon = document.getElementById(`${filter}-filter-icon`);
      const filterInput = document.getElementById(`${filter}`);
      const itemsList = document.getElementById(`${filter}-list`);

      filterLabel.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        this._closeAllFiltersExceptClicked(filter);

        filterLabel.classList.toggle("clicked");
        filterIcon.classList.toggle("fa-chevton-down");
        filterIcon.classList.toggle("fa-chevron-up");
        itemsList.classList.toggle("closed");

        filterInput.focus();
      };

      filterInput.onclick = (e) => {
        e.stopPropagation();
      };
    }
  }

  _addSearchWithFiltersEvents() {
    for (let filter of FILTERS) {
      const filterInput = document.getElementById(`${filter}`);
      const itemsList = document.getElementById(`${filter}-list`);

      filterInput.oninput = () => {
        console.log(`User input for ${filter} >`, filterInput.value);
      };

      itemsList.onclick = (e) => e.stopPropagation();
    }
  }
}
