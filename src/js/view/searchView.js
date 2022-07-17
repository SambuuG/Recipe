import { elements } from "./base";

const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `;
  //ul ruugaa nemne
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};
export const clearSearchResult = () => {
  elements.searchResultList.innerHTML = "";
  elements.pageButtons.innerHTML = "";
};
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, currentPage = 1, resPerPage = 10) => {
  //Hailtiin ur dung huudaslaj uzuuleh
  const start = (currentPage - 1) * resPerPage;
  const end = currentPage * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);

  //towchiig gargah
  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(currentPage, totalPages);
};

const createButton = (
  page,
  type,
  direction
) => `<button class="btn-inline results__btn--${type}" data-goto=${page}>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${direction}"></use>
</svg>
<span>Хуудас ${page}</span>
</button>`;

const renderButtons = (currentPage, totalPages) => {
  let buttonHTML;
  if (currentPage === 1 && totalPages > 1) {
    // 1 deh huudas, 2 dah huudas gargana
    buttonHTML = createButton(2, "next", "right");
  } else if (currentPage < totalPages) {
    // omnoh bolon daraagin huudas shiljih towch uzuulne
    buttonHTML = createButton(currentPage - 1, "prev", "left");
    buttonHTML += createButton(currentPage + 1, "next", "right");
  } else if (currentPage === totalPages) {
    // suuliin huudas bn, omnoh ruu shiljuuleh gargana
    buttonHTML = createButton(currentPage - 1, "prev", "left");
  }
  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHTML);
};
