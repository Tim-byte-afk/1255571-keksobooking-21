'use strict';

const cardTemplate = document.querySelector(`#card`).content;
const mapPopup = cardTemplate.querySelector(`.popup`);
const filtersContainer = document.querySelector(`.map__filters-container`);

const createCard = (offerData, parentContainer) => {
  const rooms = offerData.offer.rooms + ` ` + window.util.declOfNum(offerData.offer.rooms, [`комната`, `комнаты`, `комнат`]);
  const guests = offerData.offer.guests + ` ` + window.util.declOfNum(offerData.offer.guests, [`гостя`, `гостей`, `гостей`]) + `.`;
  const capacityValue = rooms + ` для ` + guests;

  const typeOfHousing = window.data.OFFER_TYPES[offerData.offer.type].label;

  const fragment = document.createDocumentFragment();
  const mapPopupCopy = mapPopup.cloneNode(true);

  const popupImg = mapPopupCopy.querySelector(`img`);
  if (offerData.author.avatar) {
    popupImg.src = offerData.author.avatar;
  } else {
    popupImg.remove();
  }

  const popupTitle = mapPopupCopy.querySelector(`.popup__title`);
  if (offerData.offer.title) {
    popupTitle.textContent = offerData.offer.title;
  } else {
    popupTitle.remove();
  }

  const popupAdress = mapPopupCopy.querySelector(`.popup__text--address`);
  if (offerData.offer.address) {
    popupAdress.textContent = offerData.offer.address;
  } else {
    popupAdress.remove();
  }

  const popupPrice = mapPopupCopy.querySelector(`.popup__text--price`);
  if (offerData.offer.price) {
    popupPrice.textContent = offerData.offer.price + `₽/ночь`;
  } else {
    popupPrice.remove();
  }

  const popupType = mapPopupCopy.querySelector(`.popup__type`);
  if (offerData.offer.type) {
    popupType.textContent = typeOfHousing;
  } else {
    popupType.remove();
  }

  const popupCapacity = mapPopupCopy.querySelector(`.popup__text--capacity`);
  if (offerData.offer.rooms && offerData.offer.guests) {
    popupCapacity.textContent = capacityValue;
  } else {
    popupCapacity.remove();
  }

  const popupTime = mapPopupCopy.querySelector(`.popup__text--time`);
  if (offerData.offer.checkin && offerData.offer.checkout) {
    popupTime.textContent = `Заезд после ` + offerData.offer.checkin + `, выезд до ` + offerData.offer.checkout;
  } else {
    popupTime.remove();
  }

  const popupDescription = mapPopupCopy.querySelector(`.popup__description`);
  if (offerData.offer.description) {
    popupDescription.textContent = offerData.offer.description;
  } else {
    popupDescription.remove();
  }

  const popupFeatures = mapPopupCopy.querySelector(`.popup__features`);
  popupFeatures.innerHTML = ``;

  if (offerData.offer.features.length > 0) {
    for (const featureObj of offerData.offer.features) {
      const tmpFeature = document.createElement(`li`);
      tmpFeature.classList.add(`popup__feature`, `popup__feature--` + featureObj);
      popupFeatures.appendChild(tmpFeature);
    }
  } else {
    popupFeatures.remove();
  }

  const popupPhotos = mapPopupCopy.querySelector(`.popup__photos`);
  const popupPhoto = popupPhotos.querySelector(`.popup__photo`);

  if (offerData.offer.photos.length > 0) {
    for (const photo of offerData.offer.photos) {
      const clonePhoto = popupPhoto.cloneNode(true);
      clonePhoto.src = photo;
      popupPhotos.appendChild(clonePhoto);
    }
    popupPhoto.remove();
    mapPopupCopy.appendChild(popupPhotos);
  } else {
    popupPhotos.remove();
  }

  fragment.appendChild(mapPopupCopy);
  parentContainer.insertBefore(fragment, filtersContainer);
};

window.createCard = createCard;

