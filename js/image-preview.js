const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;

const EFFECTS = {
  none: {
    name: 'Оригинал',
    range: { min: 0, max: 1 },
    step: 0.1,
    start: 1,
    applyFilter: () => 'none'
  },
  chrome: {
    name: 'Хром',
    range: { min: 0, max: 1 },
    step: 0.1,
    start: 1,
    applyFilter: (value) => `grayscale(${value})`
  },
  sepia: {
    name: 'Сепия',
    range: { min: 0, max: 1 },
    step: 0.1,
    start: 1,
    applyFilter: (value) => `sepia(${value})`
  },
  marvin: {
    name: 'Марвин',
    range: { min: 0, max: 100 },
    step: 1,
    start: 100,
    applyFilter: (value) => `invert(${value}%)`
  },
  phobos: {
    name: 'Фобос',
    range: { min: 0, max: 3 },
    step: 0.1,
    start: 3,
    applyFilter: (value) => `blur(${value}px)`
  },
  heat: {
    name: 'Зной',
    range: { min: 1, max: 3 },
    step: 0.1,
    start: 3,
    applyFilter: (value) => `brightness(${value})`
  }
};

const sliderElement = document.querySelector('.effect-level__slider');
const radios = document.querySelectorAll('input[name="effect"]');
const sliderContainer = sliderElement.parentElement;
const effectLevel = document.querySelector('.effect-level__value');
const scaleControlSmaller = document.querySelector('.scale__control--smaller'); // кнопка уменьшения масштаба изображения
const scaleControlBigger = document.querySelector('.scale__control--bigger'); // кнопка увеличения масштаба
const scaleControlValue = document.querySelector('.scale__control--value'); // поле с указанием масштаба
const previewImage = document.querySelector('.img-upload__preview img'); // превью редактируемой картинки

// Настройки слайдера по умолчанию
noUiSlider.create(sliderElement, {
  range: EFFECTS.none.range,
  start: EFFECTS.none.start,
  step: EFFECTS.none.step,
  connect: 'lower',
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function (value) {
      return parseFloat(value);
    },
  }
});
effectLevel.value = EFFECTS.none.start;

// Функция для управления видимостью слайдера
const toggleSliderVisibility = (effectName) => {
  if (effectName === 'none') {
    sliderContainer.classList.add('hidden');
  } else {
    sliderContainer.classList.remove('hidden');
  }
};

toggleSliderVisibility('none');

// Общая функция для изменения масштаба
const updateScale = (step) => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.min(Math.max(currentValue + step, MIN_SCALE), MAX_SCALE); // применяем шаг и ограничиваем сверху и снизу
  scaleControlValue.value = `${newValue}%`;
  previewImage.style.transform = `scale(${newValue / 100})`;
};

/* Эта функция обновляет скрытое поле и применяет фильтр к изображению
Из документации слайдера:
values — массив, содержащий текущие значения слайдера с применённым форматированием
handle — индекс ползунка, вызвавшего событие, начиная с нуля
values[handle] возвращает значение ползунка, вызвавшего событие */
const onSliderUpdate = (values) => {
  const checkedRadio = document.querySelector('input[name="effect"]:checked');
  const effectName = checkedRadio ? checkedRadio.value : 'none'; // Возвращает значение радиокнопки, если найдена, и none, если не найдена (защита от ошибки)
  const fieldValue = parseFloat(values[0]); // values[0] — значение единственного ползунка
  const effect = EFFECTS[effectName];
  effectLevel.value = fieldValue; // Записываем значение ползунка в скрытое поле
  if (!effect || effectName === 'none') { // !effect — защита от ошибки; effectName === 'none' - удаление фильтра при выборе эффекта "Оригинал"
    previewImage.style.filter = 'none';
    return;
  }
  previewImage.style.filter = effect.applyFilter(fieldValue);
};

sliderElement.noUiSlider.on('update', onSliderUpdate);

// Функция для обновления настроек слайдера
const updateSliderOptions = (effect) => {
  sliderElement.noUiSlider.updateOptions({
    range: effect.range,
    step: effect.step,
    start: effect.start,
  });
};

// Функция для применения начального эффекта (фильтр + поле)
const applyInitialEffect = (effectName) => {
  const effect = EFFECTS[effectName];
  if (effectName === 'none') {
    previewImage.style.filter = 'none'; // Если выбран эффект "Оригинал" (none), то удаляем все CSS-фильтры с изображения
  } else {
    previewImage.style.filter = effect.applyFilter(effect.start);
  }
  effectLevel.value = effect.start;
};

// Функция применяет выбранный эффект
const applyChosenEffect = (effectName) => {
  const effect = EFFECTS[effectName];
  toggleSliderVisibility(effectName); // управление видимостью слайдера
  if (effectName !== 'none') {
    updateSliderOptions(effect); // обновление настроек слайдера
  }
  applyInitialEffect(effectName); // задание стартовых настроек любого фильтра (фильтр + поле)
};

const resetFilters = () => {
  scaleControlValue.value = '100%'; // Сброс масштаба
  previewImage.style.transform = 'scale(1)';
  applyChosenEffect('none'); // Сброс эффекта на «Оригинал»
};

radios.forEach((radio) => {
  radio.addEventListener('change', () => {
    applyChosenEffect(radio.value);
  });
});

scaleControlSmaller.addEventListener('click', () => updateScale(-SCALE_STEP));
scaleControlBigger.addEventListener('click', () => updateScale(SCALE_STEP));

export { previewImage, resetFilters };
