// import { Auth } from 'aws-amplify';
// import Pubsub from './pubsub';
// import { NOTIF, ERROR_MESSAGES } from './constants';
// import { clearDataOnSignout } from '../services/league/endpoints';

// /**
//  * User object
//  * @namespace
//  * @property {boolean} authenticated
//  * @property {object} session - contains info about the current auth session from AWS Cognito
//  */
// var User = {};

// export function signUp(username, email, password) {
//   User.email = email;
//   User.password = password;

//   Auth.signUp({
//     username: email,
//     password: password,
//     attributes: {
//       preferred_username: username
//     }
//   }).then(response => {
//     console.log(response);
//     Pubsub.publish(NOTIF.SIGN_UP_PLEASE_CONFIRM, null);
//   }).catch(error => {
//     console.log(error);
//     User.authenticated = false;
//     clearDataOnSignout();
//     if (error.code == 'UsernameExistsException') {
//       Pubsub.publish(NOTIF.AUTH_ERROR, ERROR_MESSAGES.EMAIL_EXISTS);
//     }
//     Pubsub.publish(NOTIF.SIGN_OUT, null);
//   });
// }

// export function signIn(username, password) {
//   Auth.signIn({
//     username: username,
//     password: password
//   }).then(response => {
//     console.log(response);
//     getCurrentSession();
//   }).catch(error => {
//     console.log(error);
//     User.authenticated = false;
//     clearDataOnSignout();
//     if (error.code == 'NotAuthorizedException') {
//       Pubsub.publish(NOTIF.AUTH_ERROR, ERROR_MESSAGES.INVALID_CREDENTIALS);
//     }
//     Pubsub.publish(NOTIF.SIGN_OUT, null);
//   });
// }

// export function signOut() {
//   Auth.signOut().then(response => {
//     console.log(response);
//     User.authenticated = false;
//     User.session = false;
//     clearDataOnSignout();
//     Pubsub.publish(NOTIF.SIGN_OUT, null);
//     Pubsub.publish(NOTIF.AUTH, false);
//   }).catch(error => {
//     console.log(error);
//   })
// }

// export function getCurrentUser() {
//   Auth.currentAuthenticatedUser().then(user => {
//     console.log(user);
//   }).catch(error => {
//     console.log(error);
//   });
// }

// export function getCurrentSession() {
//   User.email = null;
//   User.password = null;
//   Auth.currentSession().then(session => {
//     console.log(session);
//     User.session = session;
//     User.authenticated = true;
//     Pubsub.publish(NOTIF.SIGN_IN, session);
//     Pubsub.publish(NOTIF.AUTH, true);
//   }).catch(error => {
//     if (error == 'No current user') {
//       Pubsub.publish(NOTIF.SIGN_OUT, null);
//     }
//     console.log(error);
//   });
// }

// export function resetPassword(oldPw, newPw) {
//   return new Promise((resolve, reject) => {
//     Auth.currentAuthenticatedUser().then(user => {
//       return Auth.changePassword(user, oldPw, newPw);
//     }).then(data => {
//       console.log(data);
//       resolve(data);
//     }).catch(error => {
//       console.log(error);
//       reject(error);
//     });
//   });
// }

// export function initiateForgotPassword({ email, code, newPassword, confirmNewPassword }) {
//   console.log('code: ' + code);
//   if (code !== undefined) {
//     return submitForgotPassword(email, code, newPassword);
//   } else {
//     return sendForgotPasswordEmail(email);
//   }
// }

// function sendForgotPasswordEmail(email) {
//   return new Promise((resolve, reject) => {
//     Auth.forgotPassword(email).then(data => {
//       console.log(data);
//       data.newFormType = 'forgotPassword-code';
//       resolve(data);
//     }).catch(error => {
//       console.log(error);
//       reject(error);
//     });
//   });
// }

// function submitForgotPassword(email, code, newPassword) {
//   return new Promise((resolve, reject) => {
//     Auth.forgotPasswordSubmit(email, code, newPassword).then(() => {
//       // this promise resolves without any data
//       resolve({ dismiss: true });
//     }).catch(error => {
//       console.log(error);
//       reject(error);
//     });
//   });
// }

// export {
//   User
// }