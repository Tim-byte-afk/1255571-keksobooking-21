'use strict';

const QUANTITY_ARRAYS = 8;

const MIN_PRICE = 1;
const MAX_PRICE = 999;

const MIN_Y_LOCATION = 130; // Согласно заданию
const MAX_Y_LOCATION = 630;

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 6;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 9;

const MAIN_PIN_SIZE_AFTER = 22;

const OFFER_TYPES = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`
];

const TIMES = [
  `12:00`,
  `13:00`,
  `14:00`
];

const FEATURES = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

const PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const getRandomArray = function (array, num) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [array[randomNumber], array[i]] = [array[i], array[randomNumber]];
  }

  const randomFixArray = array.slice(0, num + 1);

  return randomFixArray;
};

const getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const map = document.querySelector(`.map`);
const mapWidth = map.offsetWidth;

const mockGeneration = function (quantity) {
  const mockArray = [];
  for (let i = 0; i < quantity; i++) {
    const count = i + 1;
    const avatarNumber = count > 9 ? count : `0` + count;
    const locationX = getRandomNumber(1, mapWidth);
    const locationY = getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION);

    const mockObj = {
      "author": {
        "avatar": `img/avatars/user` + avatarNumber + `.png`
      },
      "offer": {
        "title": `Шикарное нечто`,
        "address": locationX + `, ` + locationY,
        "price": getRandomNumber(MIN_PRICE, MAX_PRICE),
        "type": OFFER_TYPES[getRandomNumber(0, OFFER_TYPES.length - 1)],
        "rooms": getRandomNumber(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
        "guests": getRandomNumber(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT),
        "checkin": TIMES[getRandomNumber(0, TIMES.length - 1)],
        "checkout": TIMES[getRandomNumber(0, TIMES.length - 1)],
        "features": getRandomArray(FEATURES, getRandomNumber(1, FEATURES.length - 1)),
        "description": `Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты.
        Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана.
        Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами.`,
        "photos": getRandomArray(PHOTOS, getRandomNumber(1, PHOTOS.length - 1)),
      },
      "location": {
        "x": locationX,
        "y": locationY,
      }
    };

    mockArray.push(mockObj);
  }

  return mockArray;
};

const deleteClass = function (mainClass, delClass) {
  const someClass = document.querySelector(mainClass);
  someClass.classList.remove(delClass);
};

const pinsContainer = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content;
const mapPin = pinTemplate.querySelector(`.map__pin`);

const addPins = function (array) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < array.length; i++) {
    const locationX = array[i].location.x - (PIN_WIDTH / 2);
    const locationY = array[i].location.y - PIN_HEIGHT;

    const mapPinCopy = mapPin.cloneNode(true);

    mapPinCopy.style = `left: ` + locationX + `px; top: ` + locationY + `px;`;
    fragment.appendChild(mapPinCopy);

    const mapImg = mapPinCopy.querySelector(`img`);
    mapImg.src = array[i].author.avatar;
    mapImg.alt = array[i].offer.title;
    mapPinCopy.appendChild(mapImg);

  }
  pinsContainer.appendChild(fragment);
};

const cardTemplate = document.querySelector(`#card`).content;
const mapPopup = cardTemplate.querySelector(`.popup`);
const filtersContainer = document.querySelector(`.map__filters-container`);

const declOfNum = function (number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

const addCard = function (offerData) {
  const rooms = offerData.offer.rooms + ` ` + declOfNum(offerData.offer.rooms, [`комната`, `комнаты`, `комнат`]);
  const guests = offerData.offer.guests + ` ` + declOfNum(offerData.offer.guests, [`гостя`, `гостей`, `гостей`]) + `.`;
  const capacityValue = rooms + ` для ` + guests;

  const offerType = {
    flat: `Квартира`,
    bungalow: `Бунгало`,
    house: `Дом`,
    palace: `Дворец`
  };

  const typeOfHousing = offerType[offerData.offer.type];

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
  map.insertBefore(fragment, filtersContainer);
};

const mockData = mockGeneration(QUANTITY_ARRAYS);
// deleteClass(`.map`, `map--faded`);
// addPins(mockData);
// addCard(mockData[0]);

let getAddress = function (x, y) {
  const adress = x + `, ` + y;

  return adress;
};

// getAddress(IN);

const formFieldsets = document.querySelector(`.ad-form`).querySelectorAll(`fieldset`);
const mapFilters = document.querySelector(`.map__filters`).querySelectorAll(`select, fieldset`);

const disabledPageBlocks = function () {
  const disabledList = function (elementList) {
    for (let element of elementList) {
      element.setAttribute(`disabled`, `true`);
    }
  };
  disabledList(formFieldsets);
  disabledList(mapFilters);
};

disabledPageBlocks();

const activePageBlocks = function () {
  deleteClass(`.map`, `map--faded`);
  deleteClass(`.ad-form`, `ad-form--disabled`);
  const activateList = function (elementList) {
    for (let element of elementList) {
      element.removeAttribute(`disabled`);
    }
  };
  activateList(formFieldsets);
  activateList(mapFilters);
  inputAddress.value = getCoordinate(mainMapPin, `bottom`);
};

const getCoordinate = function (someElement, method) {
  const X = Number(someElement.offsetLeft);
  const Y = Number(someElement.offsetTop);
  const Width = Number(someElement.offsetWidth);
  const Height = Number(someElement.offsetHeight);

  let coordinate = 0 + `, ` + 0;
  if (method === `center`) {
    coordinate = Math.round(X + Width / 2) + `, ` + Math.round(Y + Height / 2);
  } else if (method === `bottom`) {
    coordinate = Math.round(X + Width / 2) + `, ` + Math.round(Y + Height + MAIN_PIN_SIZE_AFTER);
  }

  return coordinate;
};

const mainMapPin = document.querySelector(`.map__pin--main`);
const inputAddress = document.querySelector(`#address`);
inputAddress.value = getCoordinate(mainMapPin, `center`);

mainMapPin.addEventListener(`mousedown`, function (evt) {
  if (typeof evt === `object`) {
    switch (evt.button) {
      case 0:
        activePageBlocks();
        break;
    }
  }
});

mainMapPin.addEventListener(`keydown`, function (evt) {
  if (evt.key === `Enter`) {
    activePageBlocks();
  }
});

const housingRooms = document.querySelector(`#room_number`);
const housingGuests = document.querySelector(`#capacity`);

const validateGuestsAndRooms = function (Guests, Rooms, mainValidateCheck) {
  const guestsNum = Number(Guests.value);
  const roomsNum = Number(Rooms.value);
  if (guestsNum > roomsNum && guestsNum !== 0 && roomsNum !== 100) {
    Guests.setCustomValidity(`Количество гостей превышает кол-во комнат на ` + (guestsNum - roomsNum));
    Rooms.setCustomValidity(`Количество комнат меньше кол-ва гостей на ` + (guestsNum - roomsNum));
  } else if ((guestsNum === 0 && roomsNum !== 100) || (roomsNum === 100 && guestsNum !== 0)) {
    Guests.setCustomValidity(`Неверное значение.`);
    Rooms.setCustomValidity(`Неверное значение.`);
  } else {
    Guests.setCustomValidity(``);
    Rooms.setCustomValidity(``);
  }

  if (mainValidateCheck) {
    Guests.reportValidity();
  } else {
    Rooms.reportValidity();
  }
};

housingGuests.addEventListener(`change`, function () {
  validateGuestsAndRooms(housingGuests, housingRooms, true);
});

housingRooms.addEventListener(`change`, function () {
  validateGuestsAndRooms(housingGuests, housingRooms, false);
});
