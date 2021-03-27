"use strict";

export class RecipeCard {
  constructor(recipe) {
    this._recipe = recipe;
  }

  _ingredientsHtml() {
    let htmlContent = "";

    for (let ingredient of this._recipe.ingredients) {
      let ingredientQuantity = ingredient.quantity
        ? ingredient.unit
          ? `&nbsp;: ${ingredient.quantity}&nbsp;${ingredient.unit}`
          : `&nbsp;: ${ingredient.quantity}`
        : "";

      htmlContent += `<p>
                      <strong>
                        ${ingredient.ingredient}
                      </strong> ${ingredientQuantity}
                    </p>`;
    }

    return htmlContent;
  }

  get html() {
    return `<article class="c-card lg4 md6 sm12">
              <div class="c-card__img"></div>

              <div class="c-card__body">
                <h2 class="c-card__title">
                  <span>${this._recipe.name}</span>
                  <span>
                    <i class="far fa-clock"></i>
                    ${this._recipe.time} min
                  </span>
                </h2>

                <div class="c-card__recipe row-12 has-gutter-lg">
                  <div class="c-card__ingredients lg6 md6 sm6">
                    ${this._ingredientsHtml()}
                  </div>

                  <div class="c-card__description lg6 md6 sm6">
                    <p>${this._recipe.description}</p>
                  </div>
                </div>
              </div>
            </article>`;
  }
}
