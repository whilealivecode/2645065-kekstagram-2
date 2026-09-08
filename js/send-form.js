import { appendElementFromTemplate, isEscapeKey } from './utils.js';
import { sendData } from './api.js';
import { resetFilters } from './image-preview.js';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Сохраняю...'
};

const imageUploadForm = document.querySelector('.img-upload__form'); // форма для загрузки и редактирования изображения
const submitButton = imageUploadForm.querySelector('.img-upload__submit'); // кнопка "Опубликовать"

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

const closeMessage = (message) => message.remove(); // Функция для закрытия сообщения при клике по кнопке

// Функция для закрытия сообщения при клике по фону сообщения
const onMessageClick = (evt, message) => {
  if (evt.target === message) { // Проверка, кликнул ли пользователь именно по фону сообщения (не по кнопке и не по внутренним элементам)
    closeMessage(message);
  }
};

// Функция для закрытия сообщения по Escape
const onMessageKeydown = (evt, message) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
    closeMessage(message);
  }
};

const onCreateMessage = (templateId, messageClass, buttonClass) => () => {
  document.querySelectorAll('.error, .success, .data-error').forEach((element) => element.remove()); // Удаляем все старые сообщения перед показом нового, чтобы на странице всегда было только одно актуальное сообщение
  const message = appendElementFromTemplate(templateId, `.${messageClass}`);
  message.setAttribute('tabindex', '-1'); // делаем сообщение фокусируемым
  message.focus(); // устанавливаем фокус на сообщении
  const button = message.querySelector(`.${buttonClass}`);
  const onClickOutside = (evt) => onMessageClick(evt, message); // Функция для закрытия сообщения при клике по фону сообщения
  button.addEventListener('click', () => closeMessage(message)); // Закрытие сообщения при клике по кнопке
  message.addEventListener('click', onClickOutside); // Закрытие сообщения при клике по фону сообщения
  message.addEventListener('keydown', (evt) => onMessageKeydown(evt, message)); // Закрытие сообщения по Escape
};

const showSuccessMessage = onCreateMessage('#success', 'success', 'success__button');
const showErrorMessage = onCreateMessage('#error', 'error', 'error__button');

const onFormSubmit = (formData, onSuccess) => {
  sendData(formData)
    .then(() => {
      onSuccess();
      resetFilters();
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage(); // сообщение об ошибке (при этом форма остаётся открытой, чтобы пользователь исправил ошибки)
    })
    .finally(() => {
      unblockSubmitButton();
    });
};

export { blockSubmitButton, onFormSubmit };
