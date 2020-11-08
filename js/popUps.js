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

  const closeButtonClickHandler = () => {
    popup.remove();
  };
  const onPopupEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      popup.remove();
    }
  };

  closeButton.addEventListener(`click`, closeButtonClickHandler);
  document.addEventListener(`keydown`, onPopupEscPress);
};

const showPopupSuccess = () => {
  const fragment = document.createDocumentFragment();
  const successPopupCopy = tempSuccess.cloneNode(true);
  const popup = successPopupCopy.querySelector(`.success`);

  fragment.appendChild(successPopupCopy);
  main.insertBefore(fragment, notice);

  const closeButtonClickHandler = () => {
    popup.remove();
  };
  const onPopupEscPress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      popup.remove();
    }
  };

  document.addEventListener(`click`, closeButtonClickHandler);
  document.addEventListener(`keydown`, onPopupEscPress);
};

window.popUps = {
  error: showPopupError,
  success: showPopupSuccess
};
