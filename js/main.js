import {renderThumbnails, thumbnail} from './thumbnails.js';
import {openBigPicture} from './full-picture.js';
import {getData} from './api.js';
import {appendElementFromTemplate} from './utils.js';
import {setGalleryFilter} from './gallery-filter.js';
import './form.js';
import './image-preview.js';

const imageFilters = document.querySelector('.img-filters--inactive');
let photos = [];

const showDataError = () => {
  const errorMessage = appendElementFromTemplate('#data-error', '.data-error');
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
};

getData()
  .then((data) => {
    photos = data;
    renderThumbnails(photos);
    imageFilters.classList.remove('img-filters--inactive');
    setGalleryFilter(photos);
  })
  .catch(() => {
    showDataError();
  });

thumbnail.addEventListener('click', (evt) => {
  const parentPicture = evt.target.closest('.picture'); // Один обработчик на родительском контейнере .pictures (делегирование)
  if (!parentPicture) {
    return; // Защита от кликов по пустому месту между миниатюрами
  }
  evt.preventDefault(); // Предотвращаем переход по ссылке, иначе получим http://localhost:3000/#
  const clickedPhotoId = Number(parentPicture.dataset.id); // При клике обработчик находит элемент <li class="picture"> через closest('.picture') и читает его dataset.id
  const targetThumb = photos.find((photo) => photo.id === clickedPhotoId); // По data-id находим миниатюру в массиве
  if (!targetThumb) {
    return; // Защита от случая, если targetThumb === undefined
  }
  openBigPicture(targetThumb); // Передаём данные в функцию открытия модального окна
});
