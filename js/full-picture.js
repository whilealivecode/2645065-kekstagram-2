import { isEscapeKey } from './utils.js';

const COUNT_STEP = 5;
let shownCommentsCount = 0;
let currentPhoto = null; // Текущий объект фотографии, открытой в полноразмерном окне - он нужен, чтобы обработчик кнопки "Загрузить ещё" знал, из какого массива брать следующие комментарии
const bigPictureContent = document.querySelector('.big-picture'); // всё содержимое окна с картинкой
const bigPictureCloseElement = bigPictureContent.querySelector('.big-picture__cancel'); // кнопка закрытия окна
const bigPicture = bigPictureContent.querySelector('img'); // сама полноразмерная картинка в DOM
const bigPictureLikes = bigPictureContent.querySelector('.likes-count');
const bigPictureCommentsTotal = bigPictureContent.querySelector('.social__comment-total-count');
const bigPictureCommentsShown = bigPictureContent.querySelector('.social__comment-shown-count');
const bigPictureComments = bigPictureContent.querySelector('.social__comments'); // список комментариев
const bigPictureDescription = bigPictureContent.querySelector('.social__caption');
const commentsLoader = bigPictureContent.querySelector('.comments-loader'); // текст "Загрузить ещё"

const renderPhotoComments = (photo, from, to) => {
  const commentsToShow = photo.comments.slice(from, to);
  let commentsHTML = '';
  commentsToShow.forEach((comment) => {
    commentsHTML +=
    `<li class="social__comment">
      <img
        class="social__picture"
        src="${comment.avatar}"
        alt="${comment.name}"
        width="35"
        height="35"
      >
      <p class="social__text">${comment.message}</p>
    </li>`;
  });
  bigPictureComments.insertAdjacentHTML('beforeend', commentsHTML);
};

const renderBigPicture = (photo) => {
  bigPicture.src = photo.url;
  bigPictureLikes.textContent = photo.likes;
  bigPictureDescription.textContent = photo.description;
};

const showComments = (photo) => {
  bigPictureComments.innerHTML = '';
  currentPhoto = photo;
  const totalCount = photo.comments.length;
  const initialCount = Math.min(COUNT_STEP, totalCount);
  renderPhotoComments(photo, shownCommentsCount, initialCount);
  shownCommentsCount = initialCount;
  bigPictureCommentsTotal.textContent = totalCount;
  bigPictureCommentsShown.textContent = initialCount;
  if (initialCount >= totalCount) { // Учитывает оба случая: totalCount <=5 и totalCount >=30
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const openBigPicture = (photo) => {
  document.body.classList.add('modal-open');
  bigPictureContent.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureKeydown);
  renderBigPicture(photo);
  showComments(photo);
};

const closeBigPicture = () => {
  bigPictureContent.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureKeydown);
  document.body.classList.remove('modal-open');
  shownCommentsCount = 0;
};

function onBigPictureKeydown (evt) { // Объявлена декларативно, иначе возникала бы ошибка "функция вызвана до её объявления"
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

const loadMoreComments = () => {
  if (!currentPhoto) {
    return; // Если currentPhoto не установлена (окно закрыто или ошибка) - выходим из обработчика, чтобы избежать ошибки
  }
  const total = currentPhoto.comments.length;
  const newCount = Math.min(shownCommentsCount + COUNT_STEP, total);
  if (shownCommentsCount < newCount) {
    renderPhotoComments(currentPhoto, shownCommentsCount, newCount);
    shownCommentsCount = newCount;
    bigPictureCommentsShown.textContent = newCount;
    if (newCount >= total) { // Учитывает оба случая: total <=5 и total >=30
      commentsLoader.classList.add('hidden');
    }
  }
};

commentsLoader.addEventListener('click', loadMoreComments); // обработчик кнопки "Загрузить ещё"

bigPictureCloseElement.addEventListener('click', closeBigPicture);

export { openBigPicture };
