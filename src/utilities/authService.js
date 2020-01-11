import { Auth } from 'aws-amplify';
import Pubsub from './pubsub';
import { NOTIF } from './constants';

var User = {};

export function signUp(username, email, password) {
  Auth.signUp({
    username: email,
    password: password,
    attributes: {
      preferred_username: username
    }
  }).then(response => {
    console.log(response);
    User.authenticated = true;
    Pubsub.publish(NOTIF.SIGN_IN, null);
  }).catch(error => {
    console.log(error);
    User.authenticated = false;
    Pubsub.publish(NOTIF.SIGN_OUT, null);
  });
}

export function signIn(username, password) {
  Auth.signIn({
    username: username,
    password: password
  }).then(response => {
    console.log(response);
    User.authenticated = true;
    Pubsub.publish(NOTIF.SIGN_IN, null);
  }).catch(error => {
    console.log(error);
    User.authenticated = false;
    Pubsub.publish(NOTIF.SIGN_OUT, null);
  });
}

export function signOut() {
  Auth.signOut().then(response => {
    console.log(response);
    User.authenticated = false;
    Pubsub.publish(NOTIF.SIGN_OUT, null);
  }).catch(error => {
    console.log(error);
  })
}

export function getCurrentUser() {
  Auth.currentAuthenticatedUser().then(user => {
    console.log(user);
  }).catch(error => {
    console.log(error);
  });
}

export function getCurrentSession() {
  Auth.currentSession().then(session => {
    console.log(session);
    User.session = session;
    User.authenticated = true;
    Pubsub.publish(NOTIF.SIGN_IN, null);
  }).catch(error => {
    console.log(error);
  })
}

export {
  User
}