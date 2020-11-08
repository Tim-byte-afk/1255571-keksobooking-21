/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!********************!*\
  !*** ./js/util.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const getRandomArray = function (array, num) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [array[randomNumber], array[i]] = [array[i], array[randomNumber]];
  }

  const randomFixArray = array.slice(0, num + 1);

  return randomFixArray;
};

const getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const declOfNum = function (number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

window.util = {
  getRandomArray,
  getRandomNumber,
  declOfNum
};

})();

(() => {
/*!************************!*\
  !*** ./js/debounce.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 500;

const debounce = (cb) => {
  let lastTimeout = null;

  return function (...parameters) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

window.debounce = debounce;


})();

(() => {
/*!**********************!*\
  !*** ./js/popUps.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const dataError = document.querySelector(`#error`).content;
const main = document.querySelector(`main`);
const notice = document.querySelector(`.notice`);

const tempSuccess = document.querySelector(`#success`).content;

const showPopupError = function (value) {
  const fragment = document.createDocumentFragment();
  const errorPopupCopy = dataError.cloneNode(true);
  const popup = errorPopupCopy.querySelector(`.error`);
  const closeButton = errorPopupCopy.querySelector(`.error__button`);

  const textMessage = errorPopupCopy.querySelector(`.error__message`);

  if (value) {
    textMessage.textContent = value;
  }

  fragment.appendChild(errorPopupCopy);
  main.insertBefore(fragment, notice);

  const closeButtonClickHandler = () => {
    popup.remove();
  };
  const onPopupEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      popup.remove();
    }
  };

  closeButton.addEventListener(`click`, closeButtonClickHandler);
  document.addEventListener(`keydown`, onPopupEscPress);
};

const showPopupSuccess = function () {
  const fragment = document.createDocumentFragment();
  const successPopupCopy = tempSuccess.cloneNode(true);
  const popup = successPopupCopy.querySelector(`.success`);

  fragment.appendChild(successPopupCopy);
  main.insertBefore(fragment, notice);

  const closeButtonClickHandler = () => {
    popup.remove();
  };
  const onPopupEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      popup.remove();
    }
  };

  document.addEventListener(`click`, closeButtonClickHandler);
  document.addEventListener(`keydown`, onPopupEscPress);
};

window.popUps = {
  showPopupError,
  showPopupSuccess
};

})();

(() => {
/*!************************!*\
  !*** ./js/loadData.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MAX_TIMEOUT = 5000;

const load = (url, method, onSuccess, onError, data) => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = `json`;

  xhr.addEventListener(`load`, function () {
    let error;
    switch (xhr.status) {
      case 200:
        onSuccess(xhr.response);
        break;
      case 400:
        error = `Неверный запрос`;
        break;
      case 401:
        error = `Пользователь не авторизован`;
        break;
      case 404:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: : ` + xhr.status + ` ` + xhr.statusText;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  xhr.timeout = MAX_TIMEOUT;

  xhr.open(method, url);

  if (data) {
    xhr.send(data);
  } else {
    xhr.send();
  }
};

window.loadData = load;

})();

(() => {
/*!********************!*\
  !*** ./js/data.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MIN_Y_LOCATION = 130; // Согласно заданию
const MAX_Y_LOCATION = 630;


const OFFER_TYPES = {
  bungalow: {
    label: `Бунгало`,
    minPrice: 0,
  },
  flat: {
    label: `Квартира`,
    minPrice: 1000,
  },
  house: {
    label: `Дом`,
    minPrice: 5000,
  },
  palace: {
    label: `Дворец`,
    minPrice: 10000,
  }
};

window.data = {
  OFFER_TYPES,
  MIN_Y_LOCATION,
  MAX_Y_LOCATION,
  response: undefined
};


})();

(() => {
/*!*******************!*\
  !*** ./js/pin.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const PIN_WIDTH = 65;
const PIN_HEIGHT = 87;
const COUNT_MAX_PIN = 5;

const pinTemplate = document.querySelector(`#pin`).content;
const mapPin = pinTemplate.querySelector(`.map__pin`);
const pinsContainer = document.querySelector(`.map__pins`);

const create = function (array) {
  const fragment = document.createDocumentFragment();
  const countMax = array.length <= COUNT_MAX_PIN ? array.length : COUNT_MAX_PIN;
  for (let i = 0; i < countMax; i++) {
    const targetOffer = array[i];

    const locationX = targetOffer.location.x - (PIN_WIDTH / 2);
    const locationY = targetOffer.location.y - PIN_HEIGHT;

    const mapPinCopy = mapPin.cloneNode(true);

    mapPinCopy.style = `left: ` + locationX + `px; top: ` + locationY + `px;`;
    mapPinCopy.dataset.id = targetOffer.id;
    fragment.appendChild(mapPinCopy);

    const mapImg = mapPinCopy.querySelector(`img`);
    mapImg.src = targetOffer.author.avatar;
    mapImg.alt = targetOffer.offer.title;
    mapPinCopy.appendChild(mapImg);
  }
  pinsContainer.appendChild(fragment);
};

window.pin = {
  elementWidth: PIN_WIDTH,
  elementHeight: PIN_HEIGHT,
  create,
};

})();

(() => {
/*!********************!*\
  !*** ./js/card.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const cardTemplate = document.querySelector(`#card`).content;
const mapPopup = cardTemplate.querySelector(`.popup`);
const filtersContainer = document.querySelector(`.map__filters-container`);

const createCard = function (offerData, parentContainer) {
  const rooms = offerData.offer.rooms + ` ` + window.util.declOfNum(offerData.offer.rooms, [`комната`, `комнаты`, `комнат`]);
  const guests = offerData.offer.guests + ` ` + window.util.declOfNum(offerData.offer.guests, [`гостя`, `гостей`, `гостей`]) + `.`;
  const capacityValue = rooms + ` для ` + guests;

  const typeOfHousing = window.data.OFFER_TYPES[offerData.offer.type].label;

  const fragment = document.createDocumentFragment();
  const mapPopupCopy = mapPopup.cloneNode(true);

  const popupImg = mapPopupCopy.querySelector(`img`);
  if (offerData.author.avatar) {
    popupImg.src = offerData.author.avatar;
  } else {
    popupImg.remove();
  }

  const popupTitle = mapPopupCopy.querySelector(`.popup__title`);
  if (offerData.offer.title) {
    popupTitle.textContent = offerData.offer.title;
  } else {
    popupTitle.remove();
  }

  const popupAdress = mapPopupCopy.querySelector(`.popup__text--address`);
  if (offerData.offer.address) {
    popupAdress.textContent = offerData.offer.address;
  } else {
    popupAdress.remove();
  }

  const popupPrice = mapPopupCopy.querySelector(`.popup__text--price`);
  if (offerData.offer.price) {
    popupPrice.textContent = offerData.offer.price + `₽/ночь`;
  } else {
    popupPrice.remove();
  }

  const popupType = mapPopupCopy.querySelector(`.popup__type`);
  if (offerData.offer.type) {
    popupType.textContent = typeOfHousing;
  } else {
    popupType.remove();
  }

  const popupCapacity = mapPopupCopy.querySelector(`.popup__text--capacity`);
  if (offerData.offer.rooms && offerData.offer.guests) {
    popupCapacity.textContent = capacityValue;
  } else {
    popupCapacity.remove();
  }

  const popupTime = mapPopupCopy.querySelector(`.popup__text--time`);
  if (offerData.offer.checkin && offerData.offer.checkout) {
    popupTime.textContent = `Заезд после ` + offerData.offer.checkin + `, выезд до ` + offerData.offer.checkout;
  } else {
    popupTime.remove();
  }

  const popupDescription = mapPopupCopy.querySelector(`.popup__description`);
  if (offerData.offer.description) {
    popupDescription.textContent = offerData.offer.description;
  } else {
    popupDescription.remove();
  }

  const popupFeatures = mapPopupCopy.querySelector(`.popup__features`);
  popupFeatures.innerHTML = ``;

  if (offerData.offer.features.length > 0) {
    for (const featureObj of offerData.offer.features) {
      const tmpFeature = document.createElement(`li`);
      tmpFeature.classList.add(`popup__feature`, `popup__feature--` + featureObj);
      popupFeatures.appendChild(tmpFeature);
    }
  } else {
    popupFeatures.remove();
  }

  const popupPhotos = mapPopupCopy.querySelector(`.popup__photos`);
  const popupPhoto = popupPhotos.querySelector(`.popup__photo`);

  if (offerData.offer.photos.length > 0) {
    for (const photo of offerData.offer.photos) {
      const clonePhoto = popupPhoto.cloneNode(true);
      clonePhoto.src = photo;
      popupPhotos.appendChild(clonePhoto);
    }
    popupPhoto.remove();
    mapPopupCopy.appendChild(popupPhotos);
  } else {
    popupPhotos.remove();
  }

  fragment.appendChild(mapPopupCopy);
  parentContainer.insertBefore(fragment, filtersContainer);
};

window.createCard = createCard;


})();

(() => {
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */



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

const uploadImage = (input, preview, isImg) => {
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
        const addImg = document.createElement(`img`);
        addImg.src = reader.result;
        addImg.width = IMG_WIDTH;
        addImg.height = IMG_HEIGHT;
        preview.appendChild(addImg);
      }
    });

    reader.readAsDataURL(file);
  }
};

adFormAvatar.addEventListener(`change`, () => uploadImage(adFormAvatar, previewAvatar, true));

adFormFoto.addEventListener(`change`, () => uploadImage(adFormFoto, previewFoto));

const cleanForm = () => {
  adForm.reset();
  previewAvatar.src = DEFAULT_SRC;
  previewFoto.querySelector(`img`).remove();
};

formTitle.setAttribute(`minlength`, MIN_TITLE_LENGTH);
formTitle.setAttribute(`maxlength`, MAX_TITLE_LENGTH);
formPrice.setAttribute(`max`, MAX_PRICE_FORM);

const adForm = document.querySelector(`.ad-form`);
const fieldsetList = adForm.querySelectorAll(`fieldset`);
const resetForm = document.querySelector(`.ad-form__reset`);

const enableList = function (elementList) {
  for (let element of elementList) {
    element.removeAttribute(`disabled`);
  }
};

const mapFilters = document.querySelector(`.map__filters`);
const filterSelect = mapFilters.querySelectorAll(`select, fieldset`);

const disableList = function (elementList) {
  for (let element of elementList) {
    element.setAttribute(`disabled`, `true`);
  }
};

const deactivateForm = function () {
  disableList(fieldsetList);
  disableList(filterSelect);
};

const activate = function () {
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

const getCoordinate = function (someElement, isBottom) {
  const x = Number(someElement.offsetLeft);
  const y = Number(someElement.offsetTop);
  const width = Number(someElement.offsetWidth);
  const height = Number(someElement.offsetHeight);
  const pinSize = isBottom ? height + MAIN_PIN_SIZE_AFTER : height / 2;
  const coordinate = Math.round(x + width / 2) + `, ` + Math.round(y + pinSize);

  return coordinate;
};

const validateGuestsAndRooms = function (guests, rooms) {
  const guestsNum = Number(guests.value);
  const roomsNum = Number(rooms.value);
  if (guestsNum > roomsNum && guestsNum !== MIN_ROOMS && roomsNum !== MAX_ROOMS) {
    rooms.setCustomValidity(`Количество комнат меньше кол-ва гостей на ` + (guestsNum - roomsNum));
  } else if ((guestsNum === MIN_ROOMS && roomsNum !== MAX_ROOMS) || (roomsNum === MAX_ROOMS && guestsNum !== MIN_ROOMS)) {
    rooms.setCustomValidity(`Неверное значение.`);
  } else {
    rooms.setCustomValidity(``);
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

housingGuests.addEventListener(`change`, function () {
  validateGuestsAndRooms(housingGuests, housingRooms);
  housingRooms.reportValidity();
});

housingRooms.addEventListener(`change`, function () {
  validateGuestsAndRooms(housingGuests, housingRooms);
  housingRooms.reportValidity();
});

formTypeOfHousing.addEventListener(`change`, function () {
  setPlaceholderForPrice();
});

formTimeIn.addEventListener(`change`, function () {
  setFormTime(formTimeIn, formTimeOut);
});

formTimeOut.addEventListener(`change`, function () {
  setFormTime(formTimeOut, formTimeIn);
});

formTitle.addEventListener(`input`, function () {
  checkEmptyFields();
});

formPrice.addEventListener(`input`, function () {
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

const resetFormHandler = () => {
  cleanForm();
  window.map.filterForm.reset();
  window.map.inputAddress.value = getCoordinate(window.map.mainElementPin);
};

resetForm.addEventListener(`click`, resetFormHandler);

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
  clean: cleanForm
};


})();

(() => {
/*!*******************!*\
  !*** ./js/map.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const START_X = 570;
const START_Y = 375;

const PRICE_TYPE = {
  middle: {
    min: 10000,
    max: 50000
  },
  low: {
    min: 0,
    max: 10000
  },
  high: {
    min: 50000,
    max: 999999999
  }
};

const MAX_COUNT = 5;
const MAX_COUNT_CHECKS = 5;
const BASE_FILTER_VALUE = `any`;

const map = document.querySelector(`.map`);
const mapWidth = map.offsetWidth;
const pinsContainer = document.querySelector(`.map__pins`);

const mapFilter = document.querySelector(`.map__filters`);
const housingTypeFilter = document.querySelector(`#housing-type`);
const housingPriceFilter = document.querySelector(`#housing-price`);
const housingRoomsFilter = document.querySelector(`#housing-rooms`);
const housingGuestsFilter = document.querySelector(`#housing-guests`);
const housingFeaturesFilter = document.querySelector(`#housing-features`);

const eventListenersList = () => {
  pinsContainer.addEventListener(`click`, function (evt) {
    openPopup(evt);
  });
};

const onPopupEscPress = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closePopup();
  }
};

const openPopup = (evt) => {
  const pin = evt.target.closest(`.map__pin:not(.map__pin--main)`);

  if (pin) {
    const pinId = pin.dataset.id;
    const targetOffer = window.data.response.find((e) => String(e.id) === String(pinId));
    removeAllPopups();
    window.createCard(targetOffer, map);
    window.map.element.querySelector(`.popup__close`).addEventListener(`click`, function () {
      closePopup();
    });
    document.addEventListener(`keydown`, onPopupEscPress);
  }
};

const closePopup = () => {
  removeAllPopups();
  document.removeEventListener(`keydown`, onPopupEscPress);
};

const removeAllPopups = () => {
  const popupToClose = window.map.element.querySelector(`.map__card`);
  if (popupToClose) {
    popupToClose.remove();
  }
};

const mainMapPin = document.querySelector(`.map__pin--main`);
const inputAddress = document.querySelector(`#address`);

const setStartedCoordinate = () => {
  mainMapPin.style.top = START_Y + `px`;
  mainMapPin.style.left = START_X + `px`;
  inputAddress.value = window.form.getCoordinate(mainMapPin);
};

const getAddress = (someElement) => {
  const width = Number(someElement.offsetWidth);
  return Math.round(someElement.offsetLeft + width / 2) + `, ` + Math.round(someElement.offsetTop);
};

const movePin = (evt) => {
  evt.preventDefault();

  let startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  const onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    let shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    let y = (mainMapPin.offsetTop - shift.y);
    let x = (mainMapPin.offsetLeft - shift.x);

    if (y < window.data.MIN_Y_LOCATION) {
      y = window.data.MIN_Y_LOCATION;
    } else if (y > window.data.MAX_Y_LOCATION) {
      y = window.data.MAX_Y_LOCATION;
    }

    if (x < 0 - window.pin.elementWidth / 2) {
      x = 0 - window.pin.elementWidth / 2;
    } else if (x > pinsContainer.offsetWidth - window.pin.elementWidth / 2) {
      x = pinsContainer.offsetWidth - window.pin.elementWidth / 2;
    }

    mainMapPin.style.top = y + `px`;
    mainMapPin.style.left = x + `px`;
    inputAddress.value = getAddress(mainMapPin);
  };

  const onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
    inputAddress.value = getAddress(mainMapPin);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
};

const removeAllPins = () => {
  const pins = document.querySelectorAll(`.map__pin:not(.map__pin--main)`);
  for (let pin of pins) {
    pin.remove();
  }
};

const checkFilter = (element, features) => {
  let count = 0;
  if (housingTypeFilter.value === BASE_FILTER_VALUE) {
    count++;
  } else if (String(element.offer.type) === String(housingTypeFilter.value)) {
    count++;
  }
  if (housingGuestsFilter.value === BASE_FILTER_VALUE) {
    count++;
  } else if (String(element.offer.guests) === String(housingGuestsFilter.value)) {
    count++;
  }
  if (housingRoomsFilter.value === BASE_FILTER_VALUE) {
    count++;
  } else if (String(element.offer.rooms) === String(housingRoomsFilter.value)) {
    count++;
  }
  if (housingPriceFilter.value === BASE_FILTER_VALUE) {
    count++;
  } else if (Number(PRICE_TYPE[housingPriceFilter.value].min) < Number(element.offer.price) && Number(PRICE_TYPE[housingPriceFilter.value].max) > Number(element.offer.price)) {
    count++;
  }

  if (Number(features.length) === 0) {
    count++;
  } else if (new Set(features.concat(element.offer.features)).size === Number(element.offer.features.length)) {
    count++;
  }

  return MAX_COUNT_CHECKS === count;
};

const filterHandler = () => {
  let modifiedData = [];
  const data = window.data.response;
  removeAllPopups();
  removeAllPins();
  const features =
    Array
    .from(housingFeaturesFilter.querySelectorAll(`input[type="checkbox"]:checked`))
    .map((checkbox) => checkbox.value);

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (checkFilter(element, features)) {
      modifiedData.push(element);
      if (MAX_COUNT === modifiedData.length) {
        break;
      }
    }
  }

  if (modifiedData.length > 0) {
    window.pin.create(modifiedData);
  }
};

housingTypeFilter.addEventListener(`change`, window.debounce(filterHandler));
housingPriceFilter.addEventListener(`change`, window.debounce(filterHandler));
housingRoomsFilter.addEventListener(`change`, window.debounce(filterHandler));
housingGuestsFilter.addEventListener(`change`, window.debounce(filterHandler));
housingFeaturesFilter.addEventListener(`change`, window.debounce(filterHandler));

window.map = {
  element: map,
  filterForm: mapFilter,
  mainElementPin: mainMapPin,
  elementWidth: mapWidth,
  elementContainer: pinsContainer,
  eventListenersList,
  inputAddress,
  setStartedCoordinate,
  removeAllPopups,
  movePin,
  removeAllPins
};

})();

(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const HTTP_GET_URL = `https://21.javascript.pages.academy/keksobooking/data`;
const HTTP_POST_URL = `https://21.javascript.pages.academy/keksobooking`;

const deactivatePage = () => {
  window.form.deactivate();
};

const activatePage = () => {
  window.form.activate(true);
};

deactivatePage();

let isPageActive = false;

const successHandler = (offers) => {
  activatePage();
  offers.forEach((offer, index) => {
    offer.id = index + 1;
  });
  window.data.response = offers;
  window.pin.create(window.data.response);
};

const errorHandler = (text) => {
  isPageActive = false;
  window.popUps.showPopupError(text);
};

const activateMap = (evt) => {
  if (!isPageActive) {
    window.loadData(HTTP_GET_URL, `GET`, successHandler, errorHandler);
    window.map.setStartedCoordinate();
    isPageActive = true;
  } else {
    window.map.movePin(evt);
  }
};

window.map.mainElementPin.addEventListener(`mousedown`, function (evt) {
  if (typeof evt === `object`) {
    switch (evt.button) {
      case 0:
        activateMap(evt);
        break;
    }
  }
});

window.map.mainElementPin.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    activateMap();
  }
});

const submitSuccessHandler = () => {
  deactivatePage();
  window.map.removeAllPopups();
  window.map.element.classList.add(`map--faded`);
  window.form.element.classList.add(`ad-form--disabled`);
  window.map.removeAllPins();
  window.form.clean();
  window.map.filterForm.reset();
  window.map.setStartedCoordinate();
  window.popUps.showPopupSuccess();
  isPageActive = false;
};

const submitErrorHandler = () => {
  window.popUps.showPopupError();
};

const submitHandler = (evt) => {
  window.loadData(HTTP_POST_URL, `POST`, submitSuccessHandler, submitErrorHandler, new FormData(window.form.element));
  evt.preventDefault();
};

window.form.element.addEventListener(`submit`, submitHandler);

})();

/******/ })()
;