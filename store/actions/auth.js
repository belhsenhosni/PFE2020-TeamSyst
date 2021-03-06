import { AsyncStorage } from 'react-native';
//import RNFetchBlob from 'ract-native-fetch-blob'

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
//var RNFetchBlob = require('react-native-fetch-blob');


let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (firstName, lastName, email, password, numTel) => {

  return async dispatch => {
    console.log(password);
    const response = await fetch(
      //'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA15f-yTvVTUjUSm4vS0v5CSEu_zxNmJnI',   
      'http://192.168.1.191:3000/api/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          numTel: numTel,
          returnSecureToken: true

        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.msg;
      let message = 'Something went wrong!';
      //if (errorId === 'EMAIL_EXISTS') {
      //  message = 'This email exists already!';
      //}
      throw new Error(errorId);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    // saveDataToStorage(resData.idToken, resData.localId);

  };
};

export const login = (email, password) => {
  //console.log("test");
  //console.log(email+password);

  return async dispatch => {
    //console.log("thty" + password);
    const response = await fetch(
      'http://192.168.1.191:3000/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.msg;
      let message = 'Something went wrong!';
      // if (errorId === 'EMAIL_NOT_FOUND') {
      //   message = 'This email could not be found!';
      // } else if (errorId === 'INVALID_PASSWORD') {
      //   message = 'This password is not valid!';
      // }
      throw new Error(errorId);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    //saveDataToStorage(resData.idToken, resData.localId);

  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

// const saveDataToStorage = (token, userId, expirationDate) => {
//   AsyncStorage.setItem(
//     'userData',
//     JSON.stringify({
//       token: token,
//       userId: userId,
//       expiryDate: expirationDate.toISOString()
//     })
//   );
// };

const saveDataToStorage = (token, userId) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId
    })
  );
};
