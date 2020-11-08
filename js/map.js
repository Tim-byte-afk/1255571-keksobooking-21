'use strict';

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
  pinsContainer.addEventListener(`click`, (evt) => {
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
    window.map.element.querySelector(`.popup__close`).addEventListener(`click`, () => {
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

  const onMouseMove = (moveEvt) => {
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

  const onMouseUp = (upEvt) => {
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
