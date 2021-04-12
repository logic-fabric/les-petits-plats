"use strict";

import { RecipeCard } from "./components/cards.js";
import { removeAccents } from "../utilities/words.js";

const FILTERS = ["ingredient", "appliance", "ustensil"];

export class HomePageBuilder {
  constructor(recipesList) {
    this._recipesList = recipesList;

    this._badgesList = [];
    this._itemsListsToDisplay = {
      ingredient: this._recipesList.sortedIngredients,
      appliance: this._recipesList.sortedAppliances,
      ustensil: this._recipesList.sortedAppliances,
    };
  }

  get _userRequest() {
    const searchBarInput = document.getElementById("search-bar-input");

    return `${searchBarInput.value} ${this._badgesList.join(" ")}`.trim();
  }

  render() {
    this._renderFiltersOptions(this._itemsListsToDisplay);
    this._renderCards(this._recipesList);

    this._addSearchBarEvents();
    this._addOpenFiltersEvents();
    this._addCloseAllFiltersEvent();
  }

  _renderFiltersOptions(itemsLists) {
    for (let filter of FILTERS) {
      const itemsList = document.getElementById(`${filter}-list`);
      const itemsQuantity = itemsList.length;

      let htmlContent = "";

      for (let item of itemsLists[filter]) {
        htmlContent += `<li>${item}</li>`;
      }

      itemsList.innerHTML = htmlContent;
    }

    this._addSearchWithFiltersEvents();
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
    const searchBarForm = document.getElementById("search-bar-form");
    const searchBarInput = document.getElementById("search-bar-input");

    searchBarForm.onclick = (e) => e.stopPropagation();

    searchBarForm.onsubmit = (e) => {
      e.preventDefault();

      searchBarInput.blur();
    };

    searchBarInput.oninput = (e) => {
      const recipesListToDisplay = this._recipesList.search(this._userRequest);
      const itemsListsToDisplay = {
        ingredient: recipesListToDisplay.sortedIngredients,
        appliance: recipesListToDisplay.sortedAppliances,
        ustensil: recipesListToDisplay.sortedAppliances,
      };

      this._renderCards(recipesListToDisplay);
      this._renderFiltersOptions(itemsListsToDisplay);
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

  _createFilterBadge(filter, textContent) {
    const filterBadgesWrapper = document.getElementById(
      `${filter}-badges-wrapper`
    );

    const badgeDiv = document.createElement("div");
    const badgeSpan = document.createElement("span");
    const badgeCloseIcon = document.createElement("i");

    badgeDiv.className = `c-badge c-badge--${filter}`;
    badgeSpan.textContent = textContent;
    badgeCloseIcon.className = "far fa-times-circle";

    badgeDiv.appendChild(badgeSpan);
    badgeDiv.appendChild(badgeCloseIcon);

    filterBadgesWrapper.appendChild(badgeDiv);

    this._badgesList.push(textContent);

    badgeCloseIcon.onclick = (e) => {
      e.stopPropagation();

      badgeDiv.remove();

      this._badgesList.splice(textContent);

      const recipesListToDisplay = this._recipesList.search(this._userRequest);
      const itemsListsToDisplay = {
        ingredient: recipesListToDisplay.sortedIngredients,
        appliance: recipesListToDisplay.sortedAppliances,
        ustensil: recipesListToDisplay.sortedAppliances,
      };

      this._renderCards(recipesListToDisplay);
      this._renderFiltersOptions(itemsListsToDisplay);
    };
  }

  _addSearchWithFiltersEvents() {
    for (let filter of FILTERS) {
      const filterInput = document.getElementById(`${filter}`);
      const itemsList = document.getElementById(`${filter}-list`);
      const itemsLines = document.querySelectorAll(`#${filter}-list li`);

      filterInput.oninput = () => {
        console.log(`User input for ${filter} >`, filterInput.value);

        const recipesListToDisplay = this._recipesList.search(
          this._userRequest
        );
        const itemsListsToDisplay = {
          ingredient: recipesListToDisplay.sortedIngredients,
          appliance: recipesListToDisplay.sortedAppliances,
          ustensil: recipesListToDisplay.sortedAppliances,
        };

        const filteredItems = [];

        for (let item of itemsListsToDisplay[filter]) {
          if (
            removeAccents(item).startsWith(removeAccents(filterInput.value))
          ) {
            filteredItems.push(item);
          }
        }

        itemsListsToDisplay[filter] = filteredItems;

        this._renderFiltersOptions(itemsListsToDisplay);
      };

      filterInput.onsubmit = () => {
        filterInput.blur();
      };

      filterInput.addEventListener("focusout", () => {
        filterInput.value = "";
      });

      itemsList.onclick = (e) => e.stopPropagation();

      for (let itemLine of itemsLines) {
        itemLine.onclick = () => {
          if (!this._badgesList.includes(itemLine.textContent)) {
            this._createFilterBadge(filter, itemLine.textContent);

            const recipesListToDisplay = this._recipesList.search(
              this._userRequest
            );
            const itemsListsToDisplay = {
              ingredient: recipesListToDisplay.sortedIngredients,
              appliance: recipesListToDisplay.sortedAppliances,
              ustensil: recipesListToDisplay.sortedAppliances,
            };

            this._renderCards(recipesListToDisplay);
            this._renderFiltersOptions(itemsListsToDisplay);
          }
        };
      }
    }
  }
}
