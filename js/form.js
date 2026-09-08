import { isEscapeKey, stopEscapePropagation } from './utils.js';
import { resetFilters } from './image-preview.js';
import { blockSubmitButton, onFormSubmit } from './send-form.js';

const HASHTAG_REGEX = /^#[a-zA-Zа-яё0-9]{1,19}$/i;
const MAX_HASHTAGS = 5;
const MIN_SYMBOLS = 2;
const MAX_SYMBOLS = 20;
const MAX_LENGTH = 140;
const RULES = [
  {
    check: (tags) => tags.some((tag) => tag.slice(1).includes('#')),
    message: 'Хэштеги разделяются пробелами'
  },
  {
    check: (tags) => tags.some((tag) => tag.length > MAX_SYMBOLS),
    message: `Максимальная длина хэштега - ${MAX_SYMBOLS} символов, включая решётку`
  },
  {
    check: (tags) => tags.some((tag) => !HASHTAG_REGEX.test(tag) && tag.length >= MIN_SYMBOLS), // каждый хэштег проверяется на то, соответствует ли он регулярному выражению + Проверка на минимальную длину - когда набрана ещё только решётка, то не показывается сообщение о буквах и цифрах
    message: 'Хэштег должен содержать только буквы и цифры'
  },
  {
    check: (tags) => tags.some((tag) => tag === '#'),
    message: 'Хэштег не может состоять только из одной решётки'
  },
  {
    check: (tags) => tags.some((tag) => tag[0] !== '#'),
    message: 'Хэштег должен начинаться с символа #'
  },
  {
    check: (tags) => {
      const lowerCaseTags = tags.map((tag) => tag.toLowerCase()); // На случай, если один и тот же хэштег встречается в разных регистрах
      const newLowerCaseTags = new Set(lowerCaseTags); // Убираем повторяющиеся хэштеги (если они есть)
      return lowerCaseTags.length !== newLowerCaseTags.size;
    },
    message: 'Хэштеги не должны повторяться'
  },
  {
    check: (tags) => tags.length > MAX_HASHTAGS,
    message: `Нельзя указывать больше ${MAX_HASHTAGS} ${getHashtagForm(MAX_HASHTAGS)}`
  }
];

const imageUploadForm = document.querySelector('.img-upload__form'); // форма для загрузки и редактирования изображения
const fileInput = document.querySelector('.img-upload__input'); // кнопка для загрузки файла
const imageEditOverlay = document.querySelector('.img-upload__overlay'); // окно редактирования изображения, появляется после выбора файла
const fileCloseElement = imageUploadForm.querySelector('.img-upload__cancel'); // кнопка закрытия формы редактирования изображения
const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');
let errorMessage = '';

const pristine = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper', // Элемент, на который будут добавляться классы
  errorClass: 'img-upload__field-wrapper--error', // Класс, обозначающий невалидное поле
  errorTextParent: 'img-upload__field-wrapper', // Элемент, куда будет выводиться текст с ошибкой
});

// Функция очищает все следы ошибок валидации Pristine и сбрасывает состояние Pristine
const clearValidationErrors = () => {
  document.querySelectorAll('.pristine-error').forEach((element) => element.remove());
  document.querySelectorAll('.img-upload__field-wrapper--error').forEach((element) => element.classList.remove('img-upload__field-wrapper--error'));
  pristine.reset();
};

const openFileToEdit = () => {
  if (fileInput.value) {
    clearValidationErrors();
    document.body.classList.add('modal-open');
    imageEditOverlay.classList.remove('hidden');
  }
  document.addEventListener('keydown', onFormKeydown);
};

const closeFileToEdit = () => {
  resetFilters();
  imageEditOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onFormKeydown);
  document.body.classList.remove('modal-open');
  imageUploadForm.reset();
  clearValidationErrors();
};

function onFormKeydown (evt) { // Объявлена декларативно, иначе возникала бы ошибка "функция вызвана до её объявления"
  if (isEscapeKey(evt)) {
    const message = document.querySelector('.error');
    if (message) {
      return; // Не закрываем оверлей
    }
    evt.preventDefault();
    closeFileToEdit();
  }
}

// Функция склоняет слово "хэштег"; объявлена декларативно, так как использована в массиве RULES, а массив RULES должен быть в начале модуля, до функций
function getHashtagForm(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  return (lastDigit === 1 && lastTwoDigits !== 11) ? 'хэштега' : 'хэштегов';
}

// Функция возвращает текущее сообщение об ошибке
const getErrorMessage = () => errorMessage;

const validateHashtags = (value) => {
  errorMessage = '';
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return true; // если массив пуст, ошибок нет
  }
  const tags = trimmedValue.split(/\s+/); // Получаем из строки с хэштегами массив
  return RULES.every((rule) => {
    const isError = rule.check(tags);
    if(isError) {
      errorMessage = rule.message;
    }
    return !isError;
  });
};

const validateDescription = (value) => value.length <= MAX_LENGTH;

fileCloseElement.addEventListener('click', closeFileToEdit);

hashtags.addEventListener('keydown', stopEscapePropagation);

description.addEventListener('keydown', stopEscapePropagation);

pristine.addValidator(hashtags, validateHashtags, getErrorMessage);
pristine.addValidator(description, validateDescription, `Длина описания - не более ${MAX_LENGTH} символов`);

imageUploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }
  blockSubmitButton();
  const formData = new FormData(evt.target);
  onFormSubmit(formData, closeFileToEdit);
});

export { closeFileToEdit, fileInput, openFileToEdit };
