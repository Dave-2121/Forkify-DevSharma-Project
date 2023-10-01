import { async } from 'regenerator-runtime';
import {
  loadRecipe,
  state,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  addBookMark,
  removeBookMark,
  UploadRecipe,
} from './model';
import view from './view/RecipeView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchview from '../js/view/SearchView.js';
import ResultsView from './view/ResultsView.js';
import PaginationView from './view/PaginationView.js';
import RecipeView from './view/RecipeView.js';
import BookMarksView from './view/BookMarksView.js';
import UploadRecipeView from './view/UploadRecipeView.js';
import { Timer } from './config';
if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function () {
  try {
    const id = window.location.hash;
    //loading recipe
    if (!window.location.hash) return;
    RecipeView.renderSpinner();

    await loadRecipe(id);

    //2)rendering the recipe
    RecipeView.render(state.recipe);

    // //tempprary
    // controlServings();
  } catch (err) {
    RecipeView.renderError();
  }
};

const ControlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();
    //1 get search query
    const query = searchview.getQuery();
    if (!query) return;
    await loadSearchResults(`${query}`);
    //2 clearing search field
    searchview._clearInputs();
    //
    if (state.search.results.length > 0) {
      ResultsView.render(getSearchResultsPage(1));
    } else {
      ResultsView.renderError();
    }
    //render initial pagination buttons
    PaginationView.render(state.search);
  } catch (err) {
    ResultsView.renderError();
  }
};

const controlPagination = function (gotopage) {
  ResultsView.render(getSearchResultsPage(gotopage));
  PaginationView.render(state.search);
};

const controlServings = function (serv) {
  //update recipe servings(in state)
  updateServings(serv);
  //Update the RecipeView
  // RecipeView.render(state.recipe);
  RecipeView.update(state.recipe);
};

const controlAddBookMarks = function () {
  //add or remove bookmarks
  if (!state.recipe.bookmarked) {
    addBookMark(state.recipe);
    RecipeView.update(state.recipe);
  } else {
    removeBookMark(state.recipe.id);
    RecipeView.update(state.recipe);
  }
  //render bookmarks
  if (state.bookmarks.length > 0) {
    BookMarksView.render(state.bookmarks);
    BookMarksView.update(state.bookmarks);
  } else {
    BookMarksView.renderError();
  }
};

const ControlBookMarks = function () {
  if (state.bookmarks.length > 0) {
    BookMarksView.render(state.bookmarks);
  }
};

const ControlUploadRecipe = async function (newRecipe) {
  try {
    //show spinner
    UploadRecipeView.renderSpinner();
    //upload the new recipe
    await UploadRecipe(newRecipe);

    //success message
    UploadRecipeView.renderMessage('Recipe Uploaded succesfully!');
    //recipe render
    RecipeView.render(state.recipe);
    //bookmark render
    BookMarksView.render(state.bookmarks);
    //change id in url
    window.history.pushState(null, '', `#${state.recipe.id}`);

    //close form window
    setTimeout(() => {
      UploadRecipeView.toggleClassList();
    }, Timer * 1000);
  } catch (err) {
    UploadRecipeView.renderError(err.message);
  }
};

const init = function () {
  RecipeView.addHandlerRender(showRecipe);
  searchview.addHandlerSearch(ControlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookMark(controlAddBookMarks);
  BookMarksView.addHandlerRender(ControlBookMarks);
  UploadRecipeView.addHandlerUpload(ControlUploadRecipe);
};
init();
