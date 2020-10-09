'use strict';

const QUANTITY_ARRAYS = 8;

const typeList = {
  "1": `palace`,
  "2": `flat`,
  "3": `house`,
  "4": `bungalow`
};

const timeList = {
  "1": `12:00`,
  "2": `13:00`,
  "3": `14:00`
};

const optionsList = {
  "1": `wifi`,
  "2": `dishwasher`,
  "3": `parking`,
  "4": `washer`,
  "5": `elevator`,
  "6": `conditioner`
};

const photoList = {
  "1": `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  "2": `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  "3": `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
};

const getRandomOptions = function (num) {
  const arrayOptions = [];
  for (let i = 0; i <= num; i++) {
    arrayOptions.push(optionsList[getRandomNumber(1, num)]);
  }

  return arrayOptions;
};

const getRandomPhoto = function (num) {
  const arrayPhoto = [];
  for (let i = 0; i <= num; i++) {
    arrayPhoto.push(photoList[getRandomNumber(1, num)]);
  }

  return arrayPhoto;
};

const getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

const mockGeneration = function (quantity) {
  const mockArray = [];
  for (let i = 1; i <= quantity; i++) {
    const mockObj = {
      "author": {
        "avatar": `img/avatars/user` + (i > 9 ? i : `0` + i) + `.png`
      },
      "offer": {
        "title": `Тестовый заголовок`,
        "address": location.x + `, ` + location.y,
        "price": getRandomNumber(1, 999),
        "type": typeList[getRandomNumber(1, 4)],
        "rooms": getRandomNumber(1, 6),
        "guests": getRandomNumber(1, 9),
        "checkin": timeList[getRandomNumber(1, 4)],
        "checkout": timeList[getRandomNumber(1, 4)],
        "features": getRandomOptions(getRandomNumber(1, 6)),
        "description": `Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты.
        Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана.
        Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами.`,
        "photos": getRandomPhoto(getRandomNumber(1, 3)),
      },
      "location": {
        "x": getRandomNumber(1, document.querySelector(`.map`).offsetWidth),
        "y": getRandomNumber(130, 630),
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

const makeElement = function (tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.classList.add(className);
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const addPins = function (array) {
  const fragment = document.createDocumentFragment();
  const listItems = document.querySelector(`.map__pins`);

  for (let i = 0; i < array.length; i++) {
    const mapPin = makeElement(`button`, `map__pin`);
    mapPin.style = `left: ` + array[i].location.x + `px; top: ` + array[i].location.y + `px;`;
    fragment.appendChild(mapPin);

    const mapImg = makeElement(`img`);
    mapImg.src = array[i].author.avatar;
    mapImg.alt = array[i].offer.title;
    mapImg.width = `40`;
    mapImg.height = `44`;
    mapPin.appendChild(mapImg);

  }
  listItems.appendChild(fragment);
};

deleteClass(`.map`, `map--faded`);
addPins(mockGeneration(QUANTITY_ARRAYS));

