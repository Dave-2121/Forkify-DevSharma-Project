import icons from 'url:../../img/icons.svg';
import View from './View.js';
class UploadRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _open__Btn = document.querySelector('.nav__btn--add-recipe');
  _close__btn = document.querySelector('.btn--close-modal');
  _SuccessMessage = ``;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerRemoveWindow();
  }
  toggleClassList() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _keypress(e) {
    if (e.key === 'Escape' && !this._overlay.classList.contains('hidden')) {
      this.toggleClassList();
    }
  }

  _addHandlerShowWindow() {
    this._open__Btn.addEventListener('click', this.toggleClassList.bind(this));
  }
  _addHandlerRemoveWindow() {
    this._close__btn.addEventListener('click', this.toggleClassList.bind(this));
    this._overlay.addEventListener('click', this.toggleClassList.bind(this));
    document.addEventListener('keydown', this._keypress.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      handler(Object.fromEntries(data));
    });
  }
}

export default new UploadRecipeView();
