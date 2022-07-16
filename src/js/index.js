require("@babel/polyfill");
import Search from "./model/Search";

const state = {};
const controlSearch = async () => {
  //1 webees hailtiin tulhuur ug gargaj awna
  const query = "pizza";

  if (query) {
    //2 Shineer hailtiin object uusgej ogno
    state.search = new Search(query);

    //3 Hailt hiihed zoriulj interface UI beldene

    //4 Hailt guitsetgene
    await state.search.doSearch();

    //5 Ur dun haruulna
    console.log(state.search.result);
  }
};

document.querySelector(".search").addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
