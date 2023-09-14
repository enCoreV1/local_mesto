// export default class Api {
  class Api {
    // constructor({
    //   baseUrl,
    //   headers
    // }) {
    //   this._baseUrl = baseUrl;
    //   this._userUrl = `${this._baseUrl}/users/me`;
    //   this._cardsUrl = `${this._baseUrl}/cards`;
    //   this._likesUrl = `${this._baseUrl}/cards/likes`;
    //   // this._token = headers['authorization'];
    //   this._headers = headers;
    // }
    constructor(options) {
      this._baseUrl = options.baseUrl;
      this._headers = options.headers;
    }
  
    // Метод проверки ответа сервера
    _getResponseData(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  
    _getHeaders() {
      const jwt = localStorage.getItem('jwt');
      return {
        'Authorization': `Bearer ${jwt}`,
        ...this._headers,
      };
    }
  
    // Получем информацию о пользователе с сервера
    // async getUserData() {
    //   const res = await fetch(this._userUrl, {
    //     // headers: {
    //     //   authorization: this._token,
    //     // }
    //     headers: this._getHeaders(),
    //   });
    //   return this._getResponseData(res);
    // }
    getUserData() {
      return fetch(`${this._baseUrl}/users/me`, {
        headers: this._getHeaders(),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Сохраняем отредактированные данные пользователя на сервере
    // async saveUserChanges({
    //   name,
    //   about
    // }) {
    //   const res = await fetch(this._userUrl, {
    //     method: 'PATCH',
    //     // headers: {
    //     //   authorization: this._token,
    //     //   'Content-Type': 'application/json'
    //     // },
    //     headers: this._getHeaders(),
    //     body: JSON.stringify({
    //       name: name,
    //       about: about,
    //     })
    //   });
    //   return this._getResponseData(res);
    // }
    saveUserChanges(data) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify({
          name: data.name,
          about: data.about,
        }),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Обновляем аватар пользователя
    // async changedAvatar(src) {
    //   const res = await fetch(`${this._userUrl}/avatar`, {
    //     method: 'PATCH',
    //     // headers: {
    //     //   authorization: this._token,
    //     //   'Content-Type': 'application/json'
    //     // },
    //     headers: this._getHeaders(),
    //     body: JSON.stringify({
    //       avatar: src,
    //     })
    //   });
    //   return this._getResponseData(res);
    // }
    changedAvatar(data) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify({
          avatar: data.avatar,
        }),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Получаем карточеки с сервера
    // async getInitialCards() {
    //   const res = await fetch(this._cardsUrl, {
    //     // headers: {
    //     //   authorization: this._token,
    //     // }
    //     headers: this._getHeaders()
    //   });
    //   return this._getResponseData(res);
    // }
    getInitialCards() {
      return fetch(`${this._baseUrl}/cards`, {
        headers: this._getHeaders(),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Добавляем новую карточку на сервер
    // async postNewCard({
    //   name,
    //   link
    // }) {
    //   const res = await fetch(this._cardsUrl, {
    //     method: 'POST',
    //     // headers: {
    //     //   authorization: this._token,
    //     //   'Content-Type': 'application/json'
    //     // },
    //     headers: this._getHeaders(),
    //     body: JSON.stringify({
    //       name: name,
    //       link: link,
    //     })
    //   });
    //   return this._getResponseData(res);
    // }
    postNewCard(user) {
      return fetch(`${this._baseUrl}/cards`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify({
          name: user.name,
          link: user.link,
        }),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Удаляем карточки пользователя с сервера
    // deleteCard(cardId) {
    //   return fetch(`${this._cardsUrl}/${cardId}`, {
    //       method: 'DELETE',
    //       // headers: {
    //       //   authorization: this._token,
    //       // }
    //       headers: this._getHeaders()
    //     })
    //     .then(res => {
    //       return this._getResponseData(res);
    //     })
    // }
    deleteCard(data) {
      return fetch(`${this._baseUrl}/cards/${data._id}`, {
        method: 'DELETE',
        headers: this._getHeaders(),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Ставим лайк карточке
    // likedCard(cardId) {
    //   return fetch(`${this._likesUrl}/${cardId}`, {
    //       method: 'PUT',
    //       // headers: {
    //       //   authorization: this._token,
    //       // }
    //       headers: this._getHeaders()
    //     })
    //     .then(res => {
    //       return this._getResponseData(res);
    //     })
    // }
    likedCard(id) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'PUT',
        headers: this._getHeaders(),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  
    // Удаляем лайк с карточки
    // dislikedCard(cardId) {
    //   return fetch(`${this._likesUrl}/${cardId}`, {
    //       method: 'DELETE',
    //       // headers: {
    //       //   authorization: this._token,
    //       // }
    //       headers: this._getHeaders()
    //     })
    //     .then(res => {
    //       return this._getResponseData(res);
    //     })
    // }
    dislikedCard(id) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: this._getHeaders(),
      }).then((res) => {
        return this._getResponseData(res);
      });
    }
  }
  
  // Создаем экземпляр класса Api
  export const api = new Api({
    // baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-68',
    baseUrl: 'https://api.mesto-gallery.student.nomoredomainsicu.ru',
    headers: {
      // authorization: '04191f74-b685-4000-9654-e8e43ee7e193',
      'Content-Type': 'application/json'
    }
  });
  
  export default api;