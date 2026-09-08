import {renderThumbnails} from './thumbnails.js';
import {debounce} from './utils.js';

const MAX_PICTURE_COUNT = 10;
const allFilters = document.querySelectorAll('.img-filters__button');
const imageFilters = document.querySelector('.img-filters'); // контейнер с кнопками фильтров
const filtersForm = document.querySelector('.img-filters__form');

let currentPhotos = []; // массив фотографий, с которыми мы работаем

// Функция получения отфильтрованного массива
const getFilteredPhotos = (filterType) => {
  switch (filterType) {
    case 'default':
      return currentPhotos.slice();
    case 'random': {
      const randomPhotos = currentPhotos.slice().sort(() => Math.random() - 0.5); // Сортируем копию массива случайным образом: вычитание 0.5 из Math.random() даёт как отрицательные, так и положительные числа, что заставляет sort() менять элементы местами непредсказуемо
      return randomPhotos.slice(0, MAX_PICTURE_COUNT);
    }
    case 'discussed':
      return currentPhotos.slice().sort((a, b) => b.comments.length - a.comments.length);
    default:
      return currentPhotos.slice();
  }
};

// Debounced функция рендеринга
const renderWithDebounce = debounce((filterType) => {
  const filteredPhotos = getFilteredPhotos(filterType);
  renderThumbnails(filteredPhotos);
});

// Обработчик клика по фильтру
const onFilterClick = (evt) => {
  const clickedButton = evt.target.closest('.img-filters__button');
  if (!clickedButton) {
    return;
  }
  allFilters.forEach((button) => button.classList.remove('img-filters__button--active')); // Снимаем выделение со всех кнопок фильтров, чтобы потом можно было установить его только на активную кнопку
  clickedButton.classList.add('img-filters__button--active');
  const filterType = clickedButton.id.replace('filter-', ''); // Полученная строка filterType используется в switch для выбора фильтрации
  renderWithDebounce(filterType);
};

// Функция настраивает фильтрацию галереи: подготавливает данные и обработчики событий
const setGalleryFilter = (photos) => {
  currentPhotos = photos;
  imageFilters.classList.remove('img-filters--inactive'); // Показать блок фильтров
  filtersForm.addEventListener('click', onFilterClick); // Один обработчик на контейнер с кнопками (делегирование)
};

export {setGalleryFilter};
