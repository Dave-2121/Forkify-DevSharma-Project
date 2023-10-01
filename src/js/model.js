import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helper';
const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};
const createRecipeData = function (data) {
  const {
    data: { recipe },
  } = data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id.slice(1)}?key=${KEY}`);
    state.recipe = createRecipeData(data);
    if (state.bookmarks.some(ele => ele.id === id.slice(1))) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export { state, loadRecipe };

const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const {
      data: { recipes },
    } = data;
    state.search.results = recipes.map(ele => {
      return {
        id: ele.id,
        image: ele.image_url,
        publisher: ele.publisher,
        title: ele.title,
        ...(recipes.key && { key: recipes.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export { loadSearchResults };

const getSearchResultsPage = function (page = state.search.currentPage) {
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9
  state.search.currentPage = page;
  return state.search.results.slice(start, end);
};

export { getSearchResultsPage };

const updateServings = function (new_servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * new_servings) / state.recipe.servings;
    //newQt=oldQt * newServings / oldServings
  });
  state.recipe.servings = new_servings;
};

export { updateServings };

const PersistBookMarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const addBookMark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as Bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  PersistBookMarks();
};

export { addBookMark };

const removeBookMark = function (id) {
  const TOdel = state.bookmarks.findIndex(ele => ele.id === state.recipe.id);

  state.bookmarks.splice(TOdel, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  PersistBookMarks();
};

export { removeBookMark };

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const UploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ele => ele[0].startsWith('ingredient') && ele[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ele => ele.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient Format! Please use the correct Format'
          );
        }
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeData(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
