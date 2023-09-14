import { request } from "./request";

// export const BASE_URL = 'https://auth.nomoreparties.co';
export const BASE_URL = 'https://api.mesto-gallery.student.nomoredomainsicu.ru';

export const register = (email, password) => {
  return request(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email, 
      password,
    })
  })
}; 

export const login = (email, password) => {
  return request(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email, 
      password,
    })
  })
};

// export const checkToken = (token) => {
//   return request(`${BASE_URL}/users/me`, {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     }
//   })
// } 
export const checkToken = (jwt) => {
  return request(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    }
  })
} 