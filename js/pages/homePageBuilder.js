"use strict";

import { RecipeCard } from "./components/cards.js";
import { removeAccents } from "../utilities/strings.js";

const BREAKPOINTS = {
  small: 840,
  medium: 1200,
};
const FILTERS = ["ingredient", "appliance", "ustensil"];
const ITEMS_LINE_HEIGHT = 39; // for 39px

export class HomePageBuilder {
  constructor(recipesList) {
    this._recipesList = recipesList;
    this._badgesList = [];
    this._filtersItems = {
      ingredient: this._recipesList.sortedIngredients,
      appliance: this._recipesList.sortedAppliances,
      ustensil: this._recipesList.sortedAppliances,
    };
  }

  get _userRequest() {
    const searchBarInput = document.getElementById("search-bar-input");

    return {
      userInput: searchBarInput.value.trim(),
      joinedBadges: this._badgesList.join(" ").trim(),
    };
  }

  getRecipesListToDisplay() {
    return this._recipesList.search(this._userRequest);
  }

  getItemsListsToDisplay(recipesList) {
    return {
      ingredient: recipesList.sortedIngredients,
      appliance: recipesList.sortedAppliances,
      ustensil: recipesList.sortedAppliances,
    };
  }

  render() {
    this._renderFiltersOptions(this._filtersItems);
    this._renderCards(this._recipesList);

    this._addSearchBarEvents();
    this._addOpenFiltersEvents();
    this._addCloseAllFiltersEvent();
    this._addResizeFiltersListsEvent();
  }

  _renderFiltersOptions(itemsLists) {
    for (let filter of FILTERS) {
      const itemsList = document.getElementById(`${filter}-list`);

      let htmlContent = "";

      for (let item of itemsLists[filter]) {
        htmlContent += `<li>${item}</li>`;
      }

      itemsList.innerHTML = htmlContent;
    }

    this._sizeAllFiltersLists();
    this._addSearchWithFiltersEvents();
  }

  _displaySearchResultMessage(recipesList) {
    const messageAside = document.getElementById("message");
    const messageSpan = document.querySelector("#message span");

    messageAside.classList.remove("opened");

    let message;
    const recipesQuantity = recipesList.recipes.length;

    if (recipesQuantity === 0) {
      message =
        'Aucune recette ne correspond à votre recherche... Vous pouvez chercher "tarte aux pommes", "poisson", etc.';
    } else {
      message = `${recipesQuantity} recette${
        recipesQuantity > 1 ? "s" : ""
      } correspond${recipesQuantity > 1 ? "ent" : ""} à votre recherche.`;
    }

    messageSpan.textContent = message;

    messageAside.classList.add("opened");

    this._addCloseMessageEvent();
  }

  _sizeFilterList(filter) {
    const itemsList = document.getElementById(`${filter}-list`);
    const itemsLines = document.querySelectorAll(`#${filter}-list li`);

    const windowWidth = window.innerWidth;
    const columnsInList =
      windowWidth < BREAKPOINTS.small
        ? 1
        : windowWidth < BREAKPOINTS.medium
        ? 2
        : 3;

    const itemsQuantity = itemsLines.length;

    itemsList.style.height = `${
      Math.ceil(itemsQuantity / columnsInList) * ITEMS_LINE_HEIGHT
    }px`;
  }

  _sizeAllFiltersLists() {
    for (let filter of FILTERS) {
      this._sizeFilterList(filter);
    }
  }

  _renderCards(recipesList) {
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let i = 0; i < recipesList.recipes.length; i++) {
      htmlContent += new RecipeCard(recipesList.recipes[i], i).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }

  _addCloseMessageEvent() {
    const messageAside = document.getElementById("message");
    const messageCloseIcon = document.querySelector("#message i");

    messageCloseIcon.onclick = () => {
      messageAside.classList.remove("opened");
    };
  }

  _addSearchBarEvents() {
    const searchBarForm = document.getElementById("search-bar-form");
    const searchBarInput = document.getElementById("search-bar-input");

    searchBarForm.onclick = (e) => e.stopPropagation();

    searchBarInput.onfocus = () => {
      this._closeAllFiltersExceptClicked();
    };

    searchBarInput.oninput = (e) => {
      let recipesListToDisplay;

      if (searchBarInput.value.length >= 3) {
        recipesListToDisplay = this.getRecipesListToDisplay();
      } else {
        recipesListToDisplay = this._recipesList;
      }

      this._renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this._displaySearchResultMessage(recipesListToDisplay);
      this._renderCards(recipesListToDisplay);
    };

    searchBarForm.onsubmit = (e) => {
      e.preventDefault();
      searchBarInput.blur();
    };
  }

  _closeAllFiltersExceptClicked(clickedFilter) {
    for (let filter of FILTERS) {
      if (filter !== clickedFilter) {
        const filterLabel = document.getElementById(`${filter}-filter-label`);
        const filterIcon = document.getElementById(`${filter}-filter-icon`);
        const itemsList = document.getElementById(`${filter}-list`);

        filterLabel.classList.remove("clicked");
        filterIcon.classList.add("fa-chevron-down");
        filterIcon.classList.remove("fa-chevron-up");
        itemsList.classList.add("closed");
      }
    }
  }

  _addCloseAllFiltersEvent() {
    const body = document.querySelector("body");

    body.onclick = () => {
      this._closeAllFiltersExceptClicked();
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

        this._sizeFilterList(filter);

        filterInput.focus();
      };

      filterInput.onclick = (e) => {
        e.stopPropagation();
      };
    }
  }

  _addResizeFiltersListsEvent() {
    window.onresize = () => {
      this._sizeAllFiltersLists();
    };
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

      this._badgesList = this._badgesList.filter((elt) => elt != textContent);

      const recipesListToDisplay = this.getRecipesListToDisplay();

      this._renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this._displaySearchResultMessage(recipesListToDisplay);
      this._renderCards(recipesListToDisplay);
    };
  }

  _addSearchWithFiltersEvents() {
    for (let filter of FILTERS) {
      const filterInput = document.getElementById(`${filter}`);
      const itemsList = document.getElementById(`${filter}-list`);
      const itemsLines = document.querySelectorAll(`#${filter}-list li`);

      filterInput.oninput = () => {
        console.log(`User input for ${filter} >`, filterInput.value);

        let itemsListsToDisplay = {};
        Object.assign(itemsListsToDisplay, this._filtersItems);

        itemsListsToDisplay[filter] = itemsListsToDisplay[
          filter
        ].filter((item) =>
          removeAccents(item).startsWith(removeAccents(filterInput.value))
        );

        this._renderFiltersOptions(itemsListsToDisplay);
        this._sizeFilterList(filter);
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

            const recipesListToDisplay = this.getRecipesListToDisplay();

            this._renderFiltersOptions(
              this.getItemsListsToDisplay(recipesListToDisplay)
            );
            this._displaySearchResultMessage(recipesListToDisplay);
            this._renderCards(recipesListToDisplay);

            window.scrollTo(0, 0);
          }
        };
      }
    }
  }
}
