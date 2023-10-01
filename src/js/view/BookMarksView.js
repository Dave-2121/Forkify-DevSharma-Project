import icons from 'url:../../img/icons.svg';
import View from './View.js';
class BookMarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmarks yet. Find a nice recipe and bookmark it';
  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return this._data
      .map(ele => {
        return `
        <li class="preview">
          <a
            class="preview__link ${
              ele.id === id ? '.preview__link--active' : ''
            }"
            href="#${ele.id}"
          >
            <figure class="preview__fig">
              <img src="${ele.image}" alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${ele.title}</h4>
              <p class="preview__publisher">${ele.publisher}</p>
              <div class="preview__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
              <svg>
                <use href="${icons}.svg#icon-user"></use>
              </svg>
            </div>
            </div>
          </a>
        </li>
      `;
      })
      .join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', function () {
      handler();
    });
  }
}

export default new BookMarksView();
