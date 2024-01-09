import React from 'react';
import { useAuthDispatch } from '../context/authContext';
import { fetchAuthSession, signIn, signOut, signUp, updatePassword, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { AUTH_ERROR_MESSAGES, AUTH_STATUS } from '../utilities/constants';
import amplifyConfig from '../utilities/amplifyConfig';

function withAuth(WrappedComponent) {
  
  return function(props) {

    const authDispatch = useAuthDispatch();

    const authSignUp = async (username, email, password) => {
      try {
        const response = await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              preferred_username: username
            }
          }
        });
        console.log(response);

        setAuthContext({
          authStatus: AUTH_STATUS.AWAITING_CONFIRMATION,
          email: email,
          password: password
        });

        return {
          isSignUpComplete: response.isSignUpComplete,
          nextStep: response.nextStep.signUpStep
        };
      } catch (error) {
        console.log(error);

        if (error.code === 'UsernameExistsException') {
          setAuthContext({
            authStatus: AUTH_STATUS.ERROR,
            authenticated: false,
            errorMessage: AUTH_ERROR_MESSAGES.EMAIL_EXISTS,
            email: null,
            password: null
          });
        }
      }
    }

    const authSignIn = async (username, password) => {
      try {
        const data = await signIn({
          username: username,
          password: password,
          options: {
            authFlowType: amplifyConfig.cognito.AUTH_FLOW
          }
        });
        console.log(data);

        if (!data.isSignedIn) {
          throw new Error('Unable to log in');
        }

        const token = await getSession();
        setAuthContext({
          token: token,
          authStatus: AUTH_STATUS.SIGNED_IN,
          authenticated: true,
          userMetadataRefresh: new Date().valueOf()
        });
      } catch (error) {
        console.log(error);
        console.log(error.message);

        if (error?.code == 'NotAuthorizedException') {
          setAuthContext({
            token: null,
            authStatus: AUTH_STATUS.SIGNED_OUT,
            authenticated: false,
            errorMessage: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
          });
        } else {
          setAuthContext({
            token: null,
            authStatus: AUTH_STATUS.SIGNED_OUT,
            authenticated: false,
            errorMessage: error?.message ? error.message : null
          });
        }
      }
    }

    const authSignOut = async () => {
      try {
        await signOut();
        authContextSignedOut();
        return true;
      } catch (error) {
        console.log(error);
        return error;
      }
    }

    const getSession = async () => {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        
        if (idToken) {
          return idToken.toString();
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    const authResetPassword = async (oldPw, newPw) => {
      await updatePassword({ oldPassword: oldPw, newPassword: newPw });
    }
    
    const initiateForgotPassword = async (email) => {
      const data = await resetPassword({ username: email });
      console.log(data);
      data.newFormType = 'forgotPassword-code';
      return data;
    }

    const submitForgotPassword = async (email, code, newPassword) => {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });
    }

    const authContextSignedOut = () => {
      setAuthContext({
        token: null,
        authStatus: AUTH_STATUS.SIGNED_OUT,
        authenticated: false,
        userId: null,
        email: null,
        password: null,
        alias: null,
        errorMessage: null
      });
    }

    const setAuthContext = ({
      token,
      authStatus,
      authenticated,
      userId,
      email,
      password,
      alias,
      userMetadataRefresh,
      errorMessage,
      clear
    }) => {
      if (clear) {
        authDispatch({ type: 'clear' });
      } else {
        token !== undefined && authDispatch({ type: 'update', key: 'token', value: token });
        authStatus !== undefined && authDispatch({ type: 'update', key: 'authStatus', value: authStatus });
        authenticated !== undefined && authDispatch({ type: 'update', key: 'authenticated', value: authenticated });
        email !== undefined && authDispatch({ type: 'update', key: 'email', value: email});
        password !== undefined && authDispatch({ type: 'update', key: 'password', value: password });
        userId !== undefined && authDispatch({ type: 'update', key: 'userId', value: userId });
        alias !== undefined && authDispatch({ type: 'update', key: 'alias', value: alias });
        userMetadataRefresh !== undefined && authDispatch({ type: 'update', key: 'userMetadataRefresh', value: userMetadataRefresh });
        errorMessage !== undefined && authDispatch({ type: 'update', key: 'errorMessage', errorMessage });
      }
    }

    return (
      <WrappedComponent
        {...props}
        signUp={authSignUp}
        signIn={authSignIn}
        signOut={authSignOut}
        getCurrentSession={getSession}
        resetPassword={authResetPassword}
        initiateForgotPassword={initiateForgotPassword}
        submitForgotPassword={submitForgotPassword}
        setAuthContext={setAuthContext}
      />
    );
  }
}

export default withAuth;