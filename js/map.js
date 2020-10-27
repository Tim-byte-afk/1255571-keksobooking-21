'use strict';

(() => {
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
      const targetOffer = window.data.mock.find((offer) => String(offer.id) === String(pinId));
      const popupToClose = window.map.element.querySelector(`.map__card`);
      if (popupToClose) {
        popupToClose.remove();
      }
      window.card(targetOffer);
      window.map.element.querySelector(`.popup__close`).addEventListener(`click`, function () {
        closePopup();
      });
      document.addEventListener(`keydown`, onPopupEscPress);
    }
  };

  const closePopup = () => {
    const popupToClose = window.map.element.querySelector(`.map__card`);
    popupToClose.remove();
    document.removeEventListener(`keydown`, onPopupEscPress);
  };

  const mainMapPin = document.querySelector(`.map__pin--main`);
  const inputAddress = document.querySelector(`#address`);
  inputAddress.value = window.form.getCoordinate(mainMapPin);

  mainMapPin.addEventListener(`mousedown`, function (evt) {
    if (typeof evt === `object`) {
      switch (evt.button) {
        case 0:
          window.form.activatePage();
          movePin(evt);
          break;
      }
    }
  });

  mainMapPin.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      window.form.activatePage();
    }
  });


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
      inputAddress.value = window.form.getCoordinate(mainMapPin, true);
    };

    const onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
      inputAddress.value = window.form.getCoordinate(mainMapPin, true);
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
    inputAddress
  };
})();
