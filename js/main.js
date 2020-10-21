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

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;

const MAX_PRICE_FORM = 1000000;

const MIN_PRICE_BUNGALOW = 0;
const MIN_PRICE_FLAT = 1000;
const MIN_PRICE_HOUSE = 5000;
const MIN_PRICE_PALACE = 10000;

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
    mapPinCopy.id = i + 1;
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

const offerType = {
  flat: `Квартира`,
  bungalow: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
};

const addCard = function (offerData) {
  const rooms = offerData.offer.rooms + ` ` + declOfNum(offerData.offer.rooms, [`комната`, `комнаты`, `комнат`]);
  const guests = offerData.offer.guests + ` ` + declOfNum(offerData.offer.guests, [`гостя`, `гостей`, `гостей`]) + `.`;
  const capacityValue = rooms + ` для ` + guests;

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
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);

  enableList(formFieldsets);
  enableList(filterSelect);
  inputAddress.setAttribute(`disabled`, `true`);
  inputAddress.value = getCoordinate(mainMapPin, true);
  validateGuestsAndRooms(housingGuests, housingRooms);
  validateTitle();
  setPlaceholderForPrice();
  validateTypeOfHousing();
  addPins(mockData);
  eventListenersList();
};

const getCoordinate = function (someElement, isBottom) {
  const x = Number(someElement.offsetLeft);
  const y = Number(someElement.offsetTop);
  const width = Number(someElement.offsetWidth);
  const height = Number(someElement.offsetHeight);
  const pinSize = isBottom ? height + MAIN_PIN_SIZE_AFTER : height / 2;
  const coordinate = Math.round(x + width / 2) + `, ` + Math.round(y + pinSize);

  return coordinate;
};

const mainMapPin = document.querySelector(`.map__pin--main`);
const inputAddress = document.querySelector(`#address`);
inputAddress.value = getCoordinate(mainMapPin);

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

const housingRooms = document.querySelector(`#room_number`);
const housingGuests = document.querySelector(`#capacity`);
const formTitle = document.querySelector(`#title`);
const formPrice = document.querySelector(`#price`);
const formTypeOfHousing = document.querySelector(`#type`);
const formTimeIn = document.querySelector(`#timein`);
const formTimeOut = document.querySelector(`#timeout`);

const validateGuestsAndRooms = function (guests, rooms) {
  const guestsNum = Number(guests.value);
  const roomsNum = Number(rooms.value);
  if (guestsNum > roomsNum && guestsNum !== 0 && roomsNum !== 100) {
    rooms.setCustomValidity(`Количество комнат меньше кол-ва гостей на ` + (guestsNum - roomsNum));
  } else if ((guestsNum === 0 && roomsNum !== 100) || (roomsNum === 100 && guestsNum !== 0)) {
    rooms.setCustomValidity(`Неверное значение.`);
  } else {
    rooms.setCustomValidity(``);
  }

  rooms.reportValidity();
};

const validateTitle = () => {
  const valueLength = formTitle.value.length;

  if (valueLength <= MIN_TITLE_LENGTH) {
    formTitle.setCustomValidity(`Требуется не менее 30 символов!`);
  } else if (valueLength >= MAX_TITLE_LENGTH) {
    formTitle.setCustomValidity(`Не более 100 символов!`);
  } else {
    formTitle.setCustomValidity(``);
  }

  formTitle.reportValidity();
};

const validatePrice = () => {
  const valueLength = formPrice.value;

  if (valueLength > MAX_PRICE_FORM) {
    formPrice.setCustomValidity(`Слишком дорого!`);
  } else {
    formPrice.setCustomValidity(``);
  }

  formPrice.reportValidity();
};

const validateTypeOfHousing = () => {
  const typeOfHousing = String(formTypeOfHousing.value);
  const typePrice = Number(formPrice.value);
  if (typeOfHousing === `bungalow` && typePrice < MIN_PRICE_BUNGALOW) {
    formTypeOfHousing.setCustomValidity(`Цена не может быть ниже ` + MIN_PRICE_BUNGALOW + `!`);
  } else if (typeOfHousing === `flat` && typePrice < MIN_PRICE_FLAT) {
    formTypeOfHousing.setCustomValidity(`Цена не может быть ниже ` + MIN_PRICE_FLAT + `!`);
  } else if (typeOfHousing === `house` && typePrice < MIN_PRICE_HOUSE) {
    formTypeOfHousing.setCustomValidity(`Цена не может быть ниже ` + MIN_PRICE_HOUSE + `!`);
  } else if (typeOfHousing === `palace` && typePrice < MIN_PRICE_PALACE) {
    formTypeOfHousing.setCustomValidity(`Цена не может быть ниже ` + MIN_PRICE_PALACE + `!`);
  } else {
    formTypeOfHousing.setCustomValidity(``);
  }

  formTypeOfHousing.reportValidity();
};

const setPlaceholderForPrice = () => {
  const typeOfHousing = String(formTypeOfHousing.value);
  if (typeOfHousing === `bungalow`) {
    formPrice.placeholder = MIN_PRICE_BUNGALOW;
  } else if (typeOfHousing === `flat`) {
    formPrice.placeholder = MIN_PRICE_FLAT;
  } else if (typeOfHousing === `house`) {
    formPrice.placeholder = MIN_PRICE_HOUSE;
  } else if (typeOfHousing === `palace`) {
    formPrice.placeholder = MIN_PRICE_PALACE;
  }
};

const validateFormTime = (formTime) => {
  if (formTime === formTimeIn) {
    formTimeOut.value = formTimeIn.value;
  } else {
    formTimeIn.value = formTimeOut.value;
  }
};

housingGuests.addEventListener(`change`, function () {
  validateGuestsAndRooms(housingGuests, housingRooms);
});

housingRooms.addEventListener(`change`, function () {
  validateGuestsAndRooms(housingGuests, housingRooms);
});

formTitle.addEventListener(`input`, function () {
  validateTitle();
});

formPrice.addEventListener(`input`, function () {
  validatePrice();
  validateTypeOfHousing();
});

formTypeOfHousing.addEventListener(`change`, function () {
  setPlaceholderForPrice();
  validateTypeOfHousing();
});

formTimeIn.addEventListener(`change`, function () {
  validateFormTime(formTimeIn);
});

formTimeOut.addEventListener(`change`, function () {
  validateFormTime(formTimeOut);
});

const eventListenersList = () => {
  // pinsContainer.addEventListener(`click`, function (evt) {   //  Вот тут срабатывает событие клик при нажатии enter, не разобрался почему.
  //   openPopup(evt);
  // });
  pinsContainer.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      openPopup(evt);
    }
  });
};

const onPopupEscPress = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closePopup();
  }
};

const openPopup = (evt) => {
  if (evt.target && evt.target.matches(`.map__pin`) && !evt.target.matches(`.map__pin--main`)) {
    addCard(mockData[evt.target.id - 1]);
    map.children[1].querySelector(`.popup__close`).addEventListener(`click`, function () {
      closePopup();
    });
    document.addEventListener(`keydown`, onPopupEscPress);

  } else if (evt.target.closest(`.map__pin`) && !evt.target.closest(`.map__pin--main`)) {
    addCard(mockData[evt.target.closest(`.map__pin`).id - 1]);
    map.children[1].querySelector(`.popup__close`).addEventListener(`click`, function () {
      closePopup();
    });
    document.addEventListener(`keydown`, onPopupEscPress);
  }
};

const closePopup = () => {
  map.children[1].remove();
  document.removeEventListener(`keydown`, onPopupEscPress);
};
