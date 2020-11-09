'use strict';

const HTTP_GET_URL = `https://21.javascript.pages.academy/keksobooking/data`;
const HTTP_POST_URL = `https://21.javascript.pages.academy/keksobooking`;

const deactivatePage = () => {
  window.form.deactivate();
  window.map.removeAllPopups();
  window.map.element.classList.add(`map--faded`);
  window.form.element.classList.add(`ad-form--disabled`);
  window.map.removeAllPins();
  window.form.clean();
  window.map.filterForm.reset();
  window.map.setStartedCoordinate();
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

window.map.mainElementPin.addEventListener(`mousedown`, (evt) => {
  if (typeof evt === `object`) {
    switch (evt.button) {
      case 0:
        activateMap(evt);
        break;
    }
  }
});

window.map.mainElementPin.addEventListener(`keydown`, (evt) => {
  if (evt.key === `Enter`) {
    activateMap();
  }
});

const submitSuccessHandler = () => {
  deactivatePage();
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

const resetFormHandler = () => {
  deactivatePage();
  isPageActive = false;
};

window.form.reset.addEventListener(`click`, resetFormHandler);

window.form.element.addEventListener(`submit`, submitHandler);
