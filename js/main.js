'use strict';

const adForm = document.querySelector(`.ad-form`);
const formFieldsets = adForm.querySelectorAll(`fieldset`);

const mapFilters = document.querySelector(`.map__filters`);
const filterSelect = mapFilters.querySelectorAll(`select, fieldset`);

const disableList = function (elementList) {
  for (let element of elementList) {
    element.setAttribute(`disabled`, `true`);
  }
};

const deactivatePage = function () {
  disableList(formFieldsets);
  disableList(filterSelect);
};

deactivatePage();

const enableList = function (elementList) {
  for (let element of elementList) {
    element.removeAttribute(`disabled`);
  }
};

const activatePage = function () {
  window.map.element.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);

  enableList(formFieldsets);
  enableList(filterSelect);
  inputAddress.setAttribute(`disabled`, `true`);
  inputAddress.value = window.form.getCoordinate(mainMapPin, true);
  window.pin(window.data.mock);
  window.form.validateGuestsAndRooms(window.form.housingGuests, window.form.housingRooms);
  window.form.setPlaceholderForPrice();
  window.map.eventListenersList();
};

const mainMapPin = document.querySelector(`.map__pin--main`);
const inputAddress = document.querySelector(`#address`);
inputAddress.value = window.form.getCoordinate(mainMapPin);

mainMapPin.addEventListener(`mousedown`, function (evt) {
  if (typeof evt === `object`) {
    switch (evt.button) {
      case 0:
        activatePage();
        break;
    }
  }
});

mainMapPin.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    activatePage();
  }
});
