const DEBOUNCE_DELAY = 500;

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

export {appendElementFromTemplate, debounce, isEscapeKey, stopEscapePropagation};
