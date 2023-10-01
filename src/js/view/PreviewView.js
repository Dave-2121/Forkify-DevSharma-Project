import icons from 'url:../../img/icons.svg';
import View from './View.js';
class PreviewView extends View {
  _parentEl = '';

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
            </div>
          </a>
        </li>
      `;
      })
      .join('');
  }
}

export default new PreviewView();
