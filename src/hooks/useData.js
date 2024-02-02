import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthState } from '../context/authContext';

/**
 * @function useData - custom hook for hitting an API endpoint
 * @param {Object} options
 * @param {String} options.baseUrl - base url of the target API
 * @param {String} options.endpoint - API endpoint
 * @param {String} options.method - HTTP method
 * @param {Object} options.headers - HTTP headers
 * @param {Function} options.processData - function for processing data returned by the API
 * @param {Array} options.conditions - a list of conditions that must evaluate to true in order to make the api call
 * @returns {[Array<Any>, Date, Function, Any, Date]}
 */
function useData({ baseUrl, endpoint, method, headers = {}, processData, conditions = [] }) {

  const isValid = useRef(false);
  const apiToken = useRef('');

  const [data, setData] = useState();
  const [fetchDate, setFetchDate] = useState();
  const [err, setErr] = useState();
  const [errDate, setErrDate] = useState();
  // const [isValid, setIsValid] = useState(false);
  const requestQueue = useRef([]);

  const { token } = useAuthState();

  // If no processing function is passed just return the data
  // The callback hook ensures that the function is only created once
  const processJson = useCallback(processData || ((jsonBody) => jsonBody), []);

  useEffect(() => {
    // setIsValid(evaluateConditions());
    isValid.current = evaluateConditions();
  }, [...conditions]);

  useEffect(() => {
    apiToken.current = token;
  }, [token]);

  useEffect(() => {
    if (isValid.current && requestQueue.current.length > 0) {
      sendQueuedRequests();
    }
  }, [isValid.current]);

  const sendQueuedRequests = () => {
    while (requestQueue.current.length > 0) {
      const { payload } = requestQueue.current.pop();
      callApi(payload);
    }
  }

  const evaluateConditions = () => {
    if (conditions.length == 0) return true;

    for (let condition of conditions) {
      if (!condition) return false;
    }

    return true;
  }

  const generateRequestOptions = (payload = {}) => {
    let options = {
      url: baseUrl + endpoint,
      headers: headers,
      method: method
    };

    if (apiToken.current) {
      options.headers['x-cognito-token'] = apiToken.current;
    }

    if (method == 'POST' || method == 'PUT') {
      options.data = payload
    }

    return options;
  }

  const fetchApi = (payload) => {
    let options = generateRequestOptions(payload);

    return new Promise((resolve, reject) => {
      axios(options).then(response => {
        const processedData = processJson(response.data);
        resolve(processedData);
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  };

  const callApi = (payload) => {
    if (isValid.current) {
      setData(null);
      setErr(null);
      fetchApi(payload).then(data => {
        setData(data);
        setFetchDate(new Date());
      }).catch(err => {
        console.log(err);
        setErr(err);
        setErrDate(new Date());
      })
    } else {
      requestQueue.current = [...requestQueue.current, { payload }];
    }
  }

  return [data, fetchDate, callApi, err, errDate];
};

export default useData;