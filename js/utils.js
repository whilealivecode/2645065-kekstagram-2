const DEBOUNCE_DELAY = 500;
const DELAY = 5000;

// Функция проверяет, нажата ли клавиша Escape
const isEscapeKey = (evt) => evt.key === 'Escape';

// Функция предотвращает всплытие события при нажатии Escape
const stopEscapePropagation = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Функция создаёт элемент из шаблона по селектору (без добавления в DOM)
const createElementFromTemplate = (templateId, selector) => {
  const template = document.querySelector(templateId).content.cloneNode(true);
  return template.querySelector(selector);
};

// Функция создаёт элемент из шаблона и добавляет его в document.body
const appendElementFromTemplate = (templateId, selector) => {
  const element = createElementFromTemplate(templateId, selector);
  document.body.append(element);
  return element;
};

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Функция для временного показа сообщения
const showTemporaryMessage = (templateId, containerSelector, textSelector = null, text = '', time = DELAY) => {
  // Клонируем содержимое шаблона и находим в нём корневой элемент сообщения
  const message = appendElementFromTemplate(templateId, containerSelector);
  // Если передан и текст, и селектор для его вставки, то ищем целевой элемент внутри сообщения; если целевой элемент есть, а текста для вставки нет, то текст целевого элемента остаётся по умолчанию, т.е. как в разметке
  if (text && textSelector) {
    const target = message.querySelector(textSelector); // целевой элемент
    if(target) {
      target.textContent = text; // Заменяем содержимое целевого элемента на переданный текст
    }
  }
  setTimeout(() => {
    message.remove();
  }, time);
};

// На случай, если у функции showTemporaryMessage все параметры одинаковые, кроме текста ошибки
const showErrorMessage = (text = '') => showTemporaryMessage('#data-error', '.data-error', '.data-error__title', text, DELAY);

export { appendElementFromTemplate, debounce, isEscapeKey, showErrorMessage, stopEscapePropagation };
