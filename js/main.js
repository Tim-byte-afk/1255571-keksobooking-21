'use strict';

const QUANTITY_ARRAYS = 8;

const MIN_PRICE = 1;
const MAX_PRICE = 999;

const MIN_Y_LOCATION = 130; // Согласно заданию
const MAX_Y_LOCATION = 630;

const map = document.querySelector(`.map`);
const MAP_WIDTH = map.offsetWidth;

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

const getRandomArray = function shuffle(array, num) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [array[randomNumber], array[i]] = [array[i], array[randomNumber]];
  }

  const randomFixArray = array.slice(0, num + 1);

  return randomFixArray;
};

const getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

const mockGeneration = function (quantity) {
  const mockArray = [];
  for (let i = 0; i < quantity; i++) {
    const count = i + 1;
    const avatarNumber = count > 9 ? count : `0` + count;
    const locationX = getRandomNumber(1, MAP_WIDTH);
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
        "rooms": getRandomNumber(1, 6),
        "guests": getRandomNumber(1, 9),
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

const pinWidth = 50;
const pinHeight = 70;

const addPins = function (array) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < array.length; i++) {
    const locationX = array[i].location.x - (pinWidth / 2);
    const locationY = array[i].location.y - pinHeight;

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

const addCard = function (element) {
  const capacityValue = (element.offer.rooms === 1 ? element.offer.rooms + ` комната для ` : element.offer.rooms + ` комнаты для `)
   + (element.offer.guests === 1 ? element.offer.guests + ` гостя.` : element.offer.guests + ` гостей.`);

  let typeOfHousing = ``;
  if (element.offer.type === `flat`) {
    typeOfHousing = `Квартира`;
  } else if (element.offer.type === `bungalow`) {
    typeOfHousing = `Бунгало`;
  } else if (element.offer.type === `house`) {
    typeOfHousing = `Дом`;
  } else if (element.offer.type === `palace`) {
    typeOfHousing = `Дворец`;
  }

  const fragment = document.createDocumentFragment();
  const mapPopupCopy = mapPopup.cloneNode(true);

  fragment.appendChild(mapPopupCopy);

  const popupImg = mapPopupCopy.querySelector(`img`);
  popupImg.src = element.author.avatar;
  mapPopupCopy.appendChild(popupImg);

  const popupTitle = mapPopupCopy.querySelector(`.popup__title`);
  popupTitle.textContent = element.offer.title;
  mapPopupCopy.appendChild(popupTitle);

  const popupAdress = mapPopupCopy.querySelector(`.popup__text--address`);
  popupAdress.textContent = element.offer.address;
  mapPopupCopy.appendChild(popupAdress);

  const popupPrice = mapPopupCopy.querySelector(`.popup__text--price`);
  popupPrice.textContent = element.offer.price + `₽/ночь`;
  mapPopupCopy.appendChild(popupPrice);

  const popupType = mapPopupCopy.querySelector(`.popup__type`);
  popupType.textContent = typeOfHousing;
  mapPopupCopy.appendChild(popupType);

  const popupCapacity = mapPopupCopy.querySelector(`.popup__text--capacity`);
  popupCapacity.textContent = capacityValue;
  mapPopupCopy.appendChild(popupCapacity);

  const popupTime = mapPopupCopy.querySelector(`.popup__text--time`);
  popupTime.textContent = `Заезд после ` + element.offer.checkin + `, выезд до ` + element.offer.checkout;
  mapPopupCopy.appendChild(popupTime);

  const popupDescription = mapPopupCopy.querySelector(`.popup__description`);
  popupDescription.textContent = element.offer.description;
  mapPopupCopy.appendChild(popupDescription);


  const popupFeatures = mapPopupCopy.querySelector(`.popup__features`);
  const popupFeature = popupFeatures.querySelectorAll(`.popup__feature`);
  const popupFeatureMain = popupFeatures.querySelector(`.popup__feature--wifi`);
  popupFeatureMain.classList.remove(`popup__feature--wifi`);

  for (const featureList of popupFeature) {
    featureList.remove();
  }
  for (const featureObj of element.offer.features) {
    const tmpFeature = popupFeatureMain.cloneNode(true);
    tmpFeature.classList.add(`popup__feature--` + featureObj);
    popupFeatures.appendChild(tmpFeature);
  }
  popupFeatureMain.remove();
  mapPopupCopy.appendChild(popupFeatures);

  const popupPhotos = mapPopupCopy.querySelector(`.popup__photos`);
  const popupPhoto = popupPhotos.querySelector(`.popup__photo`);
  for (const photo of element.offer.photos) {
    const clonePhoto = popupPhoto.cloneNode(true);
    clonePhoto.src = photo;
    popupPhotos.appendChild(clonePhoto);
  }
  popupPhoto.remove();
  mapPopupCopy.appendChild(popupPhotos);

  map.insertBefore(fragment, filtersContainer);
};

const mockData = mockGeneration(QUANTITY_ARRAYS);
deleteClass(`.map`, `map--faded`);
addPins(mockData);
addCard(mockData[0]);

