'use strict';

const httpGetURL = `https://21.javascript.pages.academy/keksobooking/data`;
const httpPostURL = `https://21.javascript.pages.academy/keksobooking`;

const deactivatePage = () => {
  window.form.deactivate();
};

const activatePage = () => {
  window.form.activate(true);
};

deactivatePage();

let isPageActive = false;

const successHandler = (data) => {
  activatePage();
  window.data.response = data;
  window.data.modified = data;
  window.pin.create(data);
};

const errorHandler = (text) => {
  isPageActive = false;
  window.popUps.showPopupError(text);
};

const activateMap = (evt) => {
  if (!isPageActive) {
    window.loadData(httpGetURL, `GET`, successHandler, errorHandler);
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
  window.form.element.reset();
  window.map.setStartedCoordinate();
  window.popUps.showPopupSuccess();
  isPageActive = false;
};

const submitErrorHandler = () => {
  window.popUps.showPopupError();
};

const submitHandler = (evt) => {
  window.loadData(httpPostURL, `POST`, submitSuccessHandler, submitErrorHandler, new FormData(window.form.element));
  evt.preventDefault();
};

window.form.element.addEventListener(`submit`, submitHandler);
