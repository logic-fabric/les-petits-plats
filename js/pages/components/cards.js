"use strict";

export class RecipeCard {
  constructor(recipe) {
    this._recipe = recipe;
  }

  _ingredientsHtml() {
    let htmlContent = "";

    for (let ingredient of this._recipe.ingredients) {
      htmlContent +=`<p>
                      <strong>
                        ${ingredient.ingredient}&nbsp;:
                      </strong> ${ingredient.quantity}
                        &nbsp;${(ingredient.unit) ? ingredient.unit : ""}
                    </p>`
    }

    return htmlContent;
  }

  get html() {
    return `<article class="card lg4 md6 sm12">
              <div class="card__img"></div>

              <div class="card__body">
                <h2 class="card__title">
                  <span>${this._recipe.name}</span>
                  <span>
                    <i class="far fa-clock"></i>
                    ${this._recipe.time} min
                  </span>
                </h2>

                <div class="card__recipe row-12 has-gutter-lg">
                  <div class="card__ingredients lg6 md6 sm6">
                    ${this._ingredientsHtml()}
                  </div>

                  <div class="card__instructions lg6 md6 sm6">
                    <p>${this._recipe.description}</p>
                  </div>
                </div>
              </div>
            </article>`
  }
}