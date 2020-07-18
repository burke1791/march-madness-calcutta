export default {
  cognito: {
    REGION: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_AUTH_REGION : process.env.REACT_APP_AUTH_REGION,
    USER_POOL_ID: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_AUTH_USER_POOL_ID : process.env.REACT_APP_AUTH_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_AUTH_APP_CLIENT_ID : process.env.REACT_APP_AUTH_APP_CLIENT_ID,
    AUTH_FLOW: 'USER_PASSWORD_AUTH'
  }
}