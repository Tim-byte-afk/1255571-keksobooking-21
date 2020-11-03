'use strict';

(() => {
  const START_X = 570;
  const START_Y = 375;

  const URL = `https://21.javascript.pages.academy/keksobooking/data`;

  const map = document.querySelector(`.map`);
  const mapWidth = map.offsetWidth;
  const pinsContainer = document.querySelector(`.map__pins`);

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
      const targetOffer = window.data.response.find((offer, index) => String(index) === String(pinId - 1));
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

  const successHandler = (data) => {
    window.form.activatePage();
    window.pin.create(data);
  };

  const errorHandler = (text) => {
    window.map.isFirstActivation = true;
    window.popUps.showPopupError(text);
  };

  const setStartedCoordinate = () => {
    mainMapPin.style.top = START_Y + `px`;
    mainMapPin.style.left = START_X + `px`;
    inputAddress.value = window.form.getCoordinate(mainMapPin);
  };

  const setListenerForActivePage = (isFirst) => {
    let isFirstActivation = isFirst;
    setStartedCoordinate();
    mainMapPin.addEventListener(`mousedown`, function (evt) {
      if (typeof evt === `object`) {
        switch (evt.button) {
          case 0:
            if (isFirstActivation) {
              window.loadData(URL, `GET`, successHandler, errorHandler);
              isFirstActivation = false;
            }
            movePin(evt);
            break;
        }
      }
    });

    mainMapPin.addEventListener(`keydown`, function (evt) {
      if (evt.key === `Enter`) {
        if (isFirstActivation) {
          window.loadData(URL, successHandler, errorHandler);
          isFirstActivation = false;
        }
      }
    });
  };

  setListenerForActivePage(true);

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

  window.map = {
    element: map,
    mainElementPin: mainMapPin,
    elementWidth: mapWidth,
    elementContainer: pinsContainer,
    eventListenersList,
    inputAddress,
    setListenerForActivePage,
    setStartedCoordinate,
    removeAllPopups
  };
})();
