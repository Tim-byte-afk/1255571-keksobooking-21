'use strict';


const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;

const MAIN_PIN_SIZE_AFTER = 22;

const MAX_PRICE_FORM = 1000000;

const MIN_ROOMS = 0;
const MAX_ROOMS = 100;

const IMG_WIDTH = 70;
const IMG_HEIGHT = 70;
const DEFAULT_SRC = `img/muffin-grey.svg`;

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const housingRooms = document.querySelector(`#room_number`);
const housingGuests = document.querySelector(`#capacity`);
const formTitle = document.querySelector(`#title`);
const formPrice = document.querySelector(`#price`);
const formTypeOfHousing = document.querySelector(`#type`);
const formTimeIn = document.querySelector(`#timein`);
const formTimeOut = document.querySelector(`#timeout`);

const adFormAvatar = document.querySelector(`.ad-form__field input[type=file]`);
const previewAvatar = document.querySelector(`.ad-form-header__preview img`);

const adFormFoto = document.querySelector(`.ad-form__upload input[type=file]`);
const previewFoto = document.querySelector(`.ad-form__photo`);

const deletePreviewFoto = () => {
  const preview = previewFoto.querySelector(`img`);
  if (preview) {
    preview.remove();
  }
};

const uploadImageHandler = (input, preview, isImg) => {
  const file = input.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      if (isImg) {
        preview.src = reader.result;
      } else {
        deletePreviewFoto();
        const addImg = document.createElement(`img`);
        addImg.src = reader.result;
        addImg.width = IMG_WIDTH;
        addImg.height = IMG_HEIGHT;
        addImg.alt = `Фотография жилья`;
        preview.appendChild(addImg);
      }
    });

    reader.readAsDataURL(file);
  }
};

adFormAvatar.addEventListener(`change`, () => uploadImageHandler(adFormAvatar, previewAvatar, true));

adFormFoto.addEventListener(`change`, () => uploadImageHandler(adFormFoto, previewFoto));

const cleanForm = () => {
  adForm.reset();
  previewAvatar.src = DEFAULT_SRC;
  deletePreviewFoto();
};

formTitle.minLength = MIN_TITLE_LENGTH;
formTitle.maxLength = MAX_TITLE_LENGTH;
formPrice.max = MAX_PRICE_FORM;

const adForm = document.querySelector(`.ad-form`);
const fieldsetList = adForm.querySelectorAll(`fieldset`);
const resetForm = document.querySelector(`.ad-form__reset`);

const enableList = (elementList) => {
  elementList.forEach((element) => {
    element.disabled = false;
  });
};

const mapFilters = document.querySelector(`.map__filters`);
const filterSelect = mapFilters.querySelectorAll(`select, fieldset`);

const disableList = (elementList) => {
  elementList.forEach((element) => {
    element.disabled = true;
  });
};

const deactivateForm = () => {
  disableList(fieldsetList);
  disableList(filterSelect);
};

const activate = () => {
  window.map.element.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);

  enableList(fieldsetList);
  enableList(filterSelect);
  window.map.inputAddress.value = getCoordinate(window.map.mainElementPin, true);
  window.form.validateGuestsAndRooms(window.form.housingGuests, window.form.housingRooms);
  window.form.setPlaceholderForPrice();
  window.map.eventListenersList();
  checkEmptyFields();
};

const getCoordinate = (someElement, isBottom) => {
  const x = Number(someElement.offsetLeft);
  const y = Number(someElement.offsetTop);
  const width = Number(someElement.offsetWidth);
  const height = Number(someElement.offsetHeight);
  const pinSize = isBottom ? height + MAIN_PIN_SIZE_AFTER : height / 2;
  const coordinate = Math.round(x + width / 2) + `, ` + Math.round(y + pinSize);

  return coordinate;
};

const validateGuestsAndRooms = (guests, rooms) => {
  const guestsNum = Number(guests.value);
  const roomsNum = Number(rooms.value);
  if (guestsNum > roomsNum && guestsNum !== MIN_ROOMS && roomsNum !== MAX_ROOMS) {
    guests.setCustomValidity(`Количество гостей больше кол-ва комнат на ` + (guestsNum - roomsNum));
  } else if ((guestsNum === MIN_ROOMS && roomsNum !== MAX_ROOMS) || (roomsNum === MAX_ROOMS && guestsNum !== MIN_ROOMS)) {
    guests.setCustomValidity(`Неверное значение.`);
  } else {
    guests.setCustomValidity(``);
  }
};

const setPlaceholderForPrice = () => {
  const typeOfHousing = String(formTypeOfHousing.value);
  const price = window.data.OFFER_TYPES[typeOfHousing].minPrice;
  formPrice.placeholder = price;
  formPrice.min = price;
};

const setFormTime = (fromSelect, toSelect) => {
  toSelect.value = fromSelect.value;
};

housingGuests.addEventListener(`change`, () => {
  validateGuestsAndRooms(housingGuests, housingRooms);
  housingGuests.reportValidity();
});

housingRooms.addEventListener(`change`, () => {
  validateGuestsAndRooms(housingGuests, housingRooms);
  housingGuests.reportValidity();
});

formTypeOfHousing.addEventListener(`change`, () => {
  setPlaceholderForPrice();
});

formTimeIn.addEventListener(`change`, () => {
  setFormTime(formTimeIn, formTimeOut);
});

formTimeOut.addEventListener(`change`, () => {
  setFormTime(formTimeOut, formTimeIn);
});

formTitle.addEventListener(`input`, () => {
  checkEmptyFields();
});

formPrice.addEventListener(`input`, () => {
  checkEmptyFields();
});

const checkEmptyFields = () => {
  if (formTitle.value === ``) {
    formTitle.setCustomValidity(`Поле не может быть пустым!`);
  } else {
    formTitle.setCustomValidity(``);
  }
  if (formPrice.value === ``) {
    formPrice.setCustomValidity(`Поле не может быть пустым!`);
  } else {
    formPrice.setCustomValidity(``);
  }
};

window.form = {
  element: adForm,
  validateGuestsAndRooms,
  setPlaceholderForPrice,
  getCoordinate,
  activate,
  deactivate: deactivateForm,
  housingRooms,
  housingGuests,
  fieldsetList,
  checkEmptyFields,
  clean: cleanForm,
  reset: resetForm
};

