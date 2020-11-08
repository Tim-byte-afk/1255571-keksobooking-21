'use strict';

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
  window.popUps.error(text);
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
  window.map.removeAllPopups();
  window.map.element.classList.add(`map--faded`);
  window.form.element.classList.add(`ad-form--disabled`);
  window.map.removeAllPins();
  window.form.clean();
  window.map.filterForm.reset();
  window.map.setStartedCoordinate();
  window.popUps.success();
  isPageActive = false;
};

const submitErrorHandler = () => {
  window.popUps.error();
};

const submitHandler = (evt) => {
  window.loadData(HTTP_POST_URL, `POST`, submitSuccessHandler, submitErrorHandler, new FormData(window.form.element));
  evt.preventDefault();
};

window.form.element.addEventListener(`submit`, submitHandler);
