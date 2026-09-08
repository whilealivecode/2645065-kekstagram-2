const thumbnail = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createThumbnail = (photo) => {
  const photoThumbnail = thumbnailTemplate.cloneNode(true);
  const pictureImage = photoThumbnail.querySelector('.picture__img');
  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  photoThumbnail.querySelector('.picture__likes').textContent = photo.likes;
  photoThumbnail.querySelector('.picture__comments').textContent = photo.comments.length;
  photoThumbnail.dataset.id = photo.id; //Это добавляет атрибут data-id к самому элементу <li class="picture">
  return photoThumbnail;
};

const clearThumbnails = () => thumbnail.querySelectorAll('.picture').forEach((item) => item.remove());

const renderThumbnails = (photos) => {
  clearThumbnails();
  const thumbnailFragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const thumbnailElement = createThumbnail(photo);
    thumbnailFragment.appendChild(thumbnailElement);
  });
  thumbnail.appendChild(thumbnailFragment);
};

export {renderThumbnails, thumbnail};
