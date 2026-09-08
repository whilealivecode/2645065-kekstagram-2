import { fileInput, openFileToEdit } from './form.js';
import { previewImage } from './image-preview.js';
import { showErrorMessage } from './utils.js';

const MIME_TYPE = 'image/';
const MessageErrorText = {
  MISSING_FILE: 'Файл не выбран',
  WRONG_FILE_TYPE: 'Файл не является изображением. Пожалуйста, выберите изображение'
};
const effectsPreview = document.querySelectorAll('.effects__preview'); // маленькие превьюшки эффектов над названиями этих эффектов

const checkFileType = () => {
  const file = fileInput.files[0];
  if (!file) {
    fileInput.value = '';
    showErrorMessage(MessageErrorText.MISSING_FILE);
    return false;
  }
  if (!file.type.startsWith(MIME_TYPE)) {
    fileInput.value = '';
    showErrorMessage(MessageErrorText.WRONG_FILE_TYPE);
    return false;
  }
  return true;
};

fileInput.addEventListener('change', () => {
  if (!checkFileType()) { // если проверка не прошла — выходим
    return;
  }
  const file = fileInput.files[0];
  const imageURL = URL.createObjectURL(file);
  previewImage.src = imageURL;
  effectsPreview.forEach((item) => { // Обновляем превью эффектов
    item.style.backgroundImage = `url('${imageURL}')`;
  });

  openFileToEdit(); // Открываем оверлей, только если файл - картинка
});
