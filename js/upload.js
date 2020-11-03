'use strict';

(() => {
  const MAX_TIMEOUT = 5000;
  const METHOD = `POST`;

  const uploadData = (url, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();

    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      let error;
      switch (xhr.status) {
        case 200:
          window.data.response = xhr.response;
          onSuccess(xhr.response);
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
        onError(error);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
    });

    xhr.timeout = MAX_TIMEOUT;

    xhr.open(METHOD, url);

    xhr.send();
  };

  window.upload = uploadData;
})();

