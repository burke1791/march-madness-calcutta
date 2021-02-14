
/**
 * @function genericContextUpdate
 * @param {Object} data key-value pairs will be sent to context
 * @param {Function} dispatch function that updates context data
 * @returns {{ success: Boolean, error: Error }}
 */
const genericContextUpdate = (data, dispatch) => {
  let keys = Object.keys(data);

  for (var key of keys) {
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