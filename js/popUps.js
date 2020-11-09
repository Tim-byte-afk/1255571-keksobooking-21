'use strict';

const dataError = document.querySelector(`#error`).content;
const main = document.querySelector(`main`);
const notice = document.querySelector(`.notice`);

const tempSuccess = document.querySelector(`#success`).content;

const showPopupError = (value) => {
  const fragment = document.createDocumentFragment();
  const errorPopupCopy = dataError.cloneNode(true);
  const popup = errorPopupCopy.querySelector(`.error`);
  const closeButton = errorPopupCopy.querySelector(`.error__button`);

  const textMessage = errorPopupCopy.querySelector(`.error__message`);

  if (value) {
    textMessage.textContent = value;
  }

  fragment.appendChild(errorPopupCopy);
  main.insertBefore(fragment, notice);

  const removeListener = () => {
    closeButton.removeEventListener(`click`, closeButtonClickHandler);
    document.removeEventListener(`keydown`, popupEscPressHandler);
  };

  const closeButtonClickHandler = () => {
    popup.remove();
    removeListener();
  };
  const popupEscPressHandler = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      popup.remove();
      removeListener();
    }
  };

  closeButton.addEventListener(`click`, closeButtonClickHandler);
  document.addEventListener(`keydown`, popupEscPressHandler);
};

const showPopupSuccess = () => {
  const fragment = document.createDocumentFragment();
  const successPopupCopy = tempSuccess.cloneNode(true);
  const popup = successPopupCopy.querySelector(`.success`);

  fragment.appendChild(successPopupCopy);
  main.insertBefore(fragment, notice);

  const removeListener = () => {
    document.removeEventListener(`click`, closeButtonClickHandler);
    document.removeEventListener(`keydown`, popupEscPressHandler);
  };

  const closeButtonClickHandler = () => {
    popup.remove();
    removeListener();
  };
  const popupEscPressHandler = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      popup.remove();
      removeListener();
    }
  };

  document.addEventListener(`click`, closeButtonClickHandler);
  document.addEventListener(`keydown`, popupEscPressHandler);
};

window.popUps = {
  showPopupError,
  showPopupSuccess
};
