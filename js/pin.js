'use strict';

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
