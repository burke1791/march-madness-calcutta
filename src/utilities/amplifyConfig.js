export default {
  apiGateway: {
    REGION: process.env.REACT_APP_API_REGION,
    URL: process.env.REACT_APP_API_URL
  },
  cognito: {
    REGION: process.env.REACT_APP_AUTH_REGION,
    USER_POOL_ID: process.env.REACT_APP_AUTH_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_AUTH_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_AUTH_IDENTITY_POOL_ID
  }
}