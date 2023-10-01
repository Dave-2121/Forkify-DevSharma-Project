import icons from 'url:../../img/icons.svg';
export default class View {
  _data = null;
  _SuccessMessage = ``;
  render(recipe) {
    if (!recipe || (Array.isArray(recipe.results) && recipe.length === 0)) {
      return this.renderError();
    }
    this._data = recipe;
    this.clear();
    const markup = this._generateMarkup();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  clear() {
    this._parentEl.innerHTML = '';
  }
  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}.svg#icon-loader"></use>
          </svg>
        </div>`;
    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}.svg#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this.clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._SuccessMessage) {
    const markup = `<div class="class">
      <div>
        <svg>
          <use href="${icons}.svg#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this.clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    if (!data || (Array.isArray(data.results) && data.results.length === 0))
      return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = [...newDOM.querySelectorAll('*')];
    const curElements = [...this._parentEl.querySelectorAll('*')];

    newElements.forEach((new_el, i) => {
      const cur_el = curElements[i];
      //updates changed text
      if (
        !new_el.isEqualNode(cur_el) &&
        new_el.firstChild?.nodeValue.trim() !== ''
      ) {
        cur_el.textContent = new_el.textContent;
      }
      //updates changed attribute
      if (!new_el.isEqualNode(cur_el)) {
        Array.from(new_el.attributes).forEach(ele =>
          cur_el.setAttribute(ele.name, ele.value)
        );
      }
    });
  }
}
