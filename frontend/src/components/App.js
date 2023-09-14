import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import ImagePopup from './ImagePopup';

import { api } from '../utils/Api.js';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import DeleteProvePopup from './DeleteProvePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

import * as auth from '../utils/auth';

import resolve from '../images/OK.png';
import reject from '../images/error.png';

function App() {
  const [currentUser, setCurrentUser] = useState({});

  // Состояние попапов
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isProfilePopupOpened, setIsProfilePopupOpened] = useState(false);
  // const [isInfoTooltip, setInfoTooltip] = useState({isOpen: false, successful: false});
  const [isInfoTooltip, setInfoTooltip] = useState(false);

  // Состояние карточек
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  // const [selectedCardDeleteProve, setSelectedCardDeleteProve] = useState({ isOpen: false, card: {} });
  const [selectedCardDeleteProve, setSelectedCardDeleteProve] = useState(false);

  // Состояние обработки 
  const [renderSaving, setRenderSaving] = useState(false);

  // Состояние авторизации пользователя и его данных
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const [popupImage, setPopupImage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const history = useHistory();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if(token){
  //     auth.checkToken(token)
  //       .then(data => {
  //         if(data){
  //           setEmail(data.data.email);
  //           handleLoggedIn();
  //           history.push('/');
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }, [history]);
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setEmail(res.user.email);
            // history.push('/');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // }, [history]);
  }, []);

  useEffect(() => {
    if (loggedIn === true) {
      history.push('/');
    }
  }, [loggedIn, history]);

  // Обработчик регистрации
  function handleRegister(email, password) {
    auth.register(email, password)
      .then(() => {
        setPopupImage(resolve);
        setPopupTitle("Вы успешно зарегистрировались!");
        history.push('/signin');
      })
      .catch(() => {
        closeAllPopups();
        setPopupImage(reject);
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
      }).finally(handleInfoTooltip);
  }

  // Обработчик авторизации
  // function handleLogin(password, email) {
  //   auth.login(password, email)
  //     .then(data => {
  //       if(data.token){
  //         setEmail(email);
  //         handleLoggedIn();
  //         history.push('/');
  //         localStorage.setItem('token', data.token);
  //       }
  //     })
  //     .catch(err => {
  //       handleInfoTooltip(false);
  //       console.log(err);
  //     }) 
  // }
  function handleLogin(email, password) {
    auth.login(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setLoggedIn(true);
        setEmail(email);
        history.push('/');
      })
      .catch(() => {
        closeAllPopups();
        setPopupImage(reject);
        setPopupTitle("Неправильная почта или пароль.");
        handleInfoTooltip();
      });
  }

  // useEffect(() => {
  //   Promise.all([api.getUserData(), api.getInitialCards()])
  //     .then(([user, cards]) => {
  //       setCurrentUser(user);
  //       setCards(cards);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  //   }, []);
  useEffect(() => {
    if (loggedIn === true) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user.user);
          setCards(cards.reverse());
        })
        .catch(() => {
          closeAllPopups();
          setPopupImage(reject);
          setPopupTitle("Что-то пошло не так! Ошибка авторизации.");
          handleInfoTooltip();
        });
    }
    // Promise.all([api.getUserData(), api.getInitialCards()])
    //   .then(([user, cards]) => {
    //     setCurrentUser(user);
    //     setCards(cards);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, [loggedIn]);

  // function handleCardLike(card) {
  //   const isLiked = card.likes.some((i) => i._id === currentUser._id);

  //   if (!isLiked) {
  //     api.likedCard(card._id)
  //       .then(newCard => {
  //         setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   } else {
  //     api.dislikedCard(card._id)
  //       .then((newCard) => {
  //         setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //     }
  // }
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    if (!isLiked) {
      api.likedCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch(() => {
          closeAllPopups();
          setPopupImage(reject);
          setPopupTitle("Что-то пошло не так! Не удалось поставить лайк.");
          handleInfoTooltip();
        });
    } else {
      api.dislikedCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch(() => {
          closeAllPopups();
          setPopupImage(reject);
          setPopupTitle("Что-то пошло не так! Не удалось снять лайк.");
          handleInfoTooltip();
        });
    }
  }

  // забыла закомментить предыдущую версию
  function handleUpdateUser(data) {
    setRenderSaving(true);
    api.saveUserChanges(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch(() => {
        setPopupImage(reject);
        setPopupTitle("Что-то пошло не так! Не удалось обновить профиль.");
        handleInfoTooltip();
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  // function handleAddPlaceSubmit(data) {
  //   setRenderSaving(true);
  //   api.postNewCard(data)
  //     .then(newCard => {
  //       setCards([newCard, ...cards]);
  //       closeAllPopups();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  //     .finally(() => {
  //       setRenderSaving(false);
  //     });
  // }
  function handleAddPlaceSubmit(data) {
    setRenderSaving(true);
    api.postNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(() => {
        closeAllPopups();
        setPopupImage(reject);
        setPopupTitle("Что-то пошло не так! Не удалось создать карточку.");
        handleInfoTooltip();
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  // function handleCardDelete(card) {
  //   setRenderSaving(true);
  //   api.deleteCard(card._id)
  //     .then(() => {
  //       setCards((items) => items.filter((c) => c._id !== card._id && c));
  //       closeAllPopups();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  //     .finally(() => {
  //       setRenderSaving(false);
  //     });
  // }
  function handleCardDelete(card) {
    setRenderSaving(true);
    api.deleteCard(card)
      .then(() => {
        setCards((items) => items.filter((c) => c !== card && c));
        closeAllPopups();
      })
      .catch(() => {
        closeAllPopups();
        setPopupImage(reject);
        setPopupTitle("Что-то пошло не так! Не удалось удалить карточку.");
        handleInfoTooltip();
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  function handleAvatarUpdate(data) {
    setRenderSaving(true);
    api.changedAvatar(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch(() => {
        closeAllPopups();
        setPopupImage(reject);
        setPopupTitle("Что-то пошло не так! Не удалось обновить аватар.");
        handleInfoTooltip();
      })
      .finally(() => {
        setRenderSaving(false);
      });
  }

  const isOpen = isAddPlacePopupOpen || isEditAvatarPopupOpen || isEditProfilePopupOpen || isProfilePopupOpened || selectedCard || isInfoTooltip;

  useEffect(() => {
    if (isOpen) {
      function handleEsc(evt) {
        if (evt.key === 'Escape') {
          closeAllPopups();
        }
      }
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      }
    }
  }, [isOpen]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleImagePopupOpen(card) {
    setSelectedCard(card);
  }

  // function handleInfoTooltip(result) {
  //   setInfoTooltip({...isInfoTooltip, isOpen: true, successful: result});
  // }
  function handleInfoTooltip() {
    setInfoTooltip(true);
  }

  // function handleDeleteProve(card) {
  //   setSelectedCardDeleteProve({ ...setSelectedCardDeleteProve, isOpen: true, card: card });
  // }
  function handleDeleteProve(card) {
    setSelectedCard(card);
    setSelectedCardDeleteProve(true);
  }

  function handlePopupCloseClick(evt) {
    if (evt.target.classList.contains('popup')) {
      closeAllPopups();
    }
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsProfilePopupOpened(false);
    setSelectedCardDeleteProve({ ...setSelectedCardDeleteProve, isOpen: false });
    setInfoTooltip(false);
  }

  // function handleLoggedIn() {
  //   setLoggedIn(true);
  // }

  // Обработчик выхода
  // function handleSignOut() {
  //   localStorage.removeItem('token');
  //   setLoggedIn(false);
  //   setEmail('');
  //   history.push('/signin');
  // }
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail('');
    history.push('/signin');
  }
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={handleSignOut} />

        <Switch>
          <ProtectedRoute
            exact path='/'
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleImagePopupOpen}
            cards={cards}
            onCardLike={handleCardLike}
            onDeleteProve={handleDeleteProve}
          />

          <Route path="/signin">
            <Login onLogin={handleLogin} />
          </Route>

          <Route path="/signup">
            <Register onRegister={handleRegister} />
          </Route>

          <Route>
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <Redirect to="/signin" />
            )}
          </Route>
        </Switch>

        <Footer />

        <ImagePopup
          card={selectedCard}
          isOpen={isProfilePopupOpened}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleUpdateUser}
          isRender={renderSaving}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleAddPlaceSubmit}
          isRender={renderSaving}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onSubmit={handleAvatarUpdate}
          isRender={renderSaving}
        />

        <DeleteProvePopup
          // deleteCard={selectedCardDeleteProve}
          isOpen={selectedCardDeleteProve}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
          onDeleteCard={handleCardDelete}
          card={selectedCard}
          isRender={renderSaving}
        />

        <InfoTooltip
          // result={isInfoTooltip}
          image={popupImage} 
          title={popupTitle}
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;