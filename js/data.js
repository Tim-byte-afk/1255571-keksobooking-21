'use strict';

(() => {
  const QUANTITY_ARRAYS = 8;

  const MIN_PRICE = 1;
  const MAX_PRICE = 999;

  const MIN_Y_LOCATION = 130; // Согласно заданию
  const MAX_Y_LOCATION = 630;
  const MIN_ROOMS_COUNT = 1;

  const MAX_ROOMS_COUNT = 6;

  const MIN_GUESTS_COUNT = 1;
  const MAX_GUESTS_COUNT = 9;

  const OFFER_TYPES = {
    bungalow: {
      label: `Бунгало`,
      minPrice: 0,
    },
    flat: {
      label: `Квартира`,
      minPrice: 1000,
    },
    house: {
      label: `Дом`,
      minPrice: 5000,
    },
    palace: {
      label: `Дворец`,
      minPrice: 10000,
    }
  };

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

  const map = document.querySelector(`.map`);
  const mapWidth = map.offsetWidth;

  const create = function (quantity) {
    const mockArray = [];
    for (let i = 0; i < quantity; i++) {
      const count = i + 1;
      const avatarNumber = count > 9 ? count : `0` + count;
      const locationX = window.util.getRandomNumber(1, mapWidth);
      const locationY = window.util.getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION);

      const mockObj = {
        "id": count,
        "author": {
          "avatar": `img/avatars/user` + avatarNumber + `.png`
        },
        "offer": {
          "title": `Шикарное нечто`,
          "address": locationX + `, ` + locationY,
          "price": window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
          "type": OFFER_TYPES[window.util.getRandomNumber(0, OFFER_TYPES.length - 1)],
          "rooms": window.util.getRandomNumber(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
          "guests": window.util.getRandomNumber(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT),
          "checkin": TIMES[window.util.getRandomNumber(0, TIMES.length - 1)],
          "checkout": TIMES[window.util.getRandomNumber(0, TIMES.length - 1)],
          "features": window.util.getRandomArray(FEATURES, window.util.getRandomNumber(1, FEATURES.length - 1)),
          "description": `Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты.
          Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана.
          Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами.`,
          "photos": window.util.getRandomArray(PHOTOS, window.util.getRandomNumber(1, PHOTOS.length - 1)),
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

  const mockData = create(QUANTITY_ARRAYS);

  window.data = {
    mock: mockData,
    OFFER_TYPES
  };
})();
