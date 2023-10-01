import icons from 'url:../../img/icons.svg';
import View from './View.js';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  _generateMarkup() {
    const NumPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(NumPages);
    //page1, and there are other pages
    if (this._data.currentPage === 1 && NumPages > 1) {
      return `  
    <button data-goto='${
      this._data.currentPage + 1
    }' class="btn--inline pagination__btn--next">
      <span>Page ${this._data.currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}.svg#icon-arrow-right"></use>
      </svg>
    </button> `;
    }

    //Last page
    if (this._data.currentPage === NumPages && NumPages > 1) {
      return `<button data-goto='${
        this._data.currentPage - 1
      }' class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}.svg#icon-arrow-left"></use>
      </svg>
       <span>Page ${this._data.currentPage - 1}</span> 
    </button>`;
    }
    //Other page
    if (this._data.currentPage < NumPages) {
      return `<button data-goto='${
        this._data.currentPage - 1
      }' class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}.svg#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.currentPage - 1}</span>
    </button>
    <button data-goto='${
      this._data.currentPage + 1
    }' class="btn--inline pagination__btn--next">
      <span>Page ${this._data.currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}.svg#icon-arrow-right"></use>
      </svg>
    </button> `;
    }
    //page 1 and there are no other pages
    return '';
  }
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const click = e.target.closest('.btn--inline');
      if (!click) return;
      console.log(click);
      const goToPage = +click.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
}

export default new PaginationView();
