require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";

const state = {};
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

const r = new Recipe(47746);
r.getRecipe();
