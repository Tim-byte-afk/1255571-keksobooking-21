'use strict';

(() => {
  let responseData;

  const load = () => {
    const xhr = new XMLHttpRequest();
    let isFirst = true;
    xhr.addEventListener(`load`, function () {
      let error;
      switch (xhr.status) {
        case 200:
          responseData = JSON.parse(xhr.responseText);
          window.data.response = responseData;
          if (isFirst) {
            window.form.activatePage();
            isFirst = false;
          }
          window.pin.create(responseData);
          break;
        case 400:
          error = `Неверный запрос`;
          break;
        case 401:
          error = `Пользователь не авторизован`;
          break;
        case 404:
          error = `Ничего не найдено`;
          break;

        default:
          error = `Cтатус ответа: : ` + xhr.status + ` ` + xhr.statusText;
      }

      if (error) {
        window.showErrorPopup(error);
        throw new Error(error);
      }
    });

    xhr.addEventListener(`error`, function () {
      window.showErrorPopup(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      window.showErrorPopup(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
    });

    xhr.timeout = 10000;

    xhr.open(`GET`, `https://21.javascript.pages.academy/keksobooking/data`);

    xhr.send();
  };

  window.loadData = load;
})();

