require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import Like from "./model/Like";
import * as listView from "./view/listView";
import * as likesView from "./view/likesView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";

const state = {};

//like tses haah

const controlSearch = async () => {
  //1 webees hailtiin tulhuur ug gargaj awna
  const query = searchView.getInput();

  if (query) {
    //2 Shineer hailtiin object uusgej ogno
    state.search = new Search(query);

    //3 Hailt hiihed zoriulj interface UI beldene
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResDiv);
    //4 Hailt guitsetgene
    await state.search.doSearch();

    //5 Ur dun haruulna
    clearLoader();
    if (state.search.result === undefined) alert("Ilertsgui");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

//joriin controller
const controlRecipe = async () => {
  // 1 url aas ID salgaj awna
  const id = window.location.hash.replace("#", "");

  if (id) {
    // 2 Joriin model uusgej ogno
    state.recipe = new Recipe(id);

    // 3 UI delgetsiig beldene
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    // 4 Joroo tataj awchirna
    await state.recipe.getRecipe();

    // 5 joriig guitsetgeh hugatsaa bolon orts tootsoolno
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // 6 Joroo delgetsend gargana
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};
//window.addEventListener("hashchange", controlRecipe);
//window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

window.addEventListener("load", (e) => {
  if (!state.likes) state.likes = new Like();
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

const controlList = () => {
  // Ortsnii model uusgene
  state.list = new List();
  // omno haragdaj bsn nairlaga tsewerlene
  listView.clearItems();
  // Ug model ruu odoo haragdaj bga ortsnii buh nairlaga hiine

  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);
    listView.renderItem(item);
  });
};

// Like controller
const controlLike = () => {
  // 1 like iin model uusgene
  if (!state.likes) state.likes = new Like();

  // 2 odoo haragdaj bga joriin id oloh
  const currentRecipeId = state.recipe.id;

  // 3 ene joriig like darsn esehiig shalgah
  if (state.likes.isLiked(currentRecipeId)) {
    // like darsan bol like boluilna
    state.likes.deleteLike(currentRecipeId);

    // haragdaj bga like in tsesnes ustgana
    likesView.deleteLike(currentRecipeId);
    likesView.toggleLikeBtn(false);
  } else {
    // like daraagui bol like darna
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.img_url
    );
    likesView.renderLike(newLike);
    likesView.toggleLikeBtn(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  //click hiisen li element data itemd attribute shuuh
  const id = e.target.closest(".shopping__item").dataset.itemid;
  // oldson id tei ortsiig modeloos ustgana
  state.list.deleteItem(id);
  // delgetsees ID tai ortsiig bas ustgana
  listView.deleteItem(id);
});
