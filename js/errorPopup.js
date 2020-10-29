'use strict';

(() => {
  const dataError = document.querySelector(`#data-error`).content;
  const main = document.querySelector(`main`);
  const notice = document.querySelector(`.notice`);

  const showError = function (value) {
    const fragment = document.createDocumentFragment();
    const errorPopupCopy = dataError.cloneNode(true);
    const popup = errorPopupCopy.querySelector(`.error`);
    const button = errorPopupCopy.querySelector(`.error__my`);

    const p = errorPopupCopy.querySelector(`.error__message`);

    if (value) {
      p.textContent = value;
    } else {
      p.textContent = `Возникла ошибка при получении данных от сервера.`;
    }

    fragment.appendChild(errorPopupCopy);
    main.insertBefore(fragment, notice);

    const delErrorPopUp = () => {
      popup.remove();
      button.removeEventListener(`keydown`, delErrorPopUp);
    };

    button.addEventListener(`click`, delErrorPopUp);
  };

  window.showErrorPopup = showError;
})();
