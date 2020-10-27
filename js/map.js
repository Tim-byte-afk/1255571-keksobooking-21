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

  window.map = {
    element: map,
    elementWidth: mapWidth,
    eventListenersList
  };
})();
