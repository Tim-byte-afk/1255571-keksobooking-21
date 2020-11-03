'use strict';

(() => {
  const MIN_TITLE_LENGTH = 30;
  const MAX_TITLE_LENGTH = 100;

  const MAIN_PIN_SIZE_AFTER = 22;

  const MAX_PRICE_FORM = 1000000;

  const MIN_ROOMS = 0;
  const MAX_ROOMS = 100;

  const URL = `https://21.javascript.pages.academy/keksobooking`;

  const housingRooms = document.querySelector(`#room_number`);
  const housingGuests = document.querySelector(`#capacity`);
  const formTitle = document.querySelector(`#title`);
  const formPrice = document.querySelector(`#price`);
  const formTypeOfHousing = document.querySelector(`#type`);
  const formTimeIn = document.querySelector(`#timein`);
  const formTimeOut = document.querySelector(`#timeout`);

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

  const deactivatePage = function () {
    disableList(fieldsetList);
    disableList(filterSelect);
  };

  const activatePage = function () {
    window.map.element.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);

    enableList(fieldsetList);
    enableList(filterSelect);
    window.map.inputAddress.value = getCoordinate(window.map.mainElementPin, true);
    window.form.validateGuestsAndRooms(window.form.housingGuests, window.form.housingRooms);
    window.form.setPlaceholderForPrice();
    window.map.eventListenersList();
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

  const removeAllPins = () => {
    const pins = document.querySelectorAll(`.map__pin:not(.map__pin--main)`);
    for (let pin of pins) {
      pin.remove();
    }
  };

  const successHandler = () => {
    deactivatePage();
    window.map.removeAllPopups();
    window.map.element.classList.add(`map--faded`);
    adForm.classList.add(`ad-form--disabled`);
    removeAllPins();
    adForm.reset();
    window.map.setListenerForActivePage(true);
    window.popUps.showPopupSuccess();
  };

  const errorHandler = () => {
    window.popUps.showPopupError();
  };

  const submitHandler = (evt) => {
    window.loadData(URL, `POST`, successHandler, errorHandler, new FormData(adForm));
    evt.preventDefault();
  };

  const resetFormHandler = () => {
    adForm.reset();
    window.map.inputAddress.value = getCoordinate(window.map.mainElementPin, true);
  };

  adForm.addEventListener(`submit`, submitHandler);
  resetForm.addEventListener(`click`, resetFormHandler);

  window.form = {
    validateGuestsAndRooms,
    setPlaceholderForPrice,
    getCoordinate,
    activatePage,
    deactivatePage,
    housingRooms,
    housingGuests,
    fieldsetList,
  };
})();
