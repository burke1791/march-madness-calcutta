
/**
 * @function genericContextUpdate
 * @param {Object} data key-value pairs will be sent to context
 * @param {Function} dispatch function that updates context data
 * @returns {{ success: Boolean, error: Error }}
 */
const genericContextUpdate = (data, dispatch) => {
  if (data === undefined || data === null) {
    return {
      success: false,
      error: 'data param is empty'
    };
  }

  const keys = Object.keys(data);

  for (let key of keys) {
    dispatch({ type: 'update', key: key, value: data[key] });
  }

  return {
    success: true,
    error: null
  };
};

export {
  genericContextUpdate
};