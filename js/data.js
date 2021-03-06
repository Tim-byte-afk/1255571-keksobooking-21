'use strict';

const MIN_Y_LOCATION = 130; // Согласно заданию
const MAX_Y_LOCATION = 630;


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

window.data = {
  OFFER_TYPES,
  MIN_Y_LOCATION,
  MAX_Y_LOCATION,
  response: undefined
};

