const formatMoney = (value) => {
  let moneyString;
  value = parseFloat(+value);

  if (value < 0) {
    moneyString = '-$';
    value = Math.abs(value);
  } else {
    moneyString = '$';
  }

  return moneyString + value.toFixed(2);
}

const formatTimestamp = (value) => {
  let date = new Date(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const formatDatestamp = (value) => {
  let date = new Date(value);
  return date.toLocaleString();
}

const formatDateTime = (value) => {
  let date = new Date(value);
  let options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleString(undefined, options);
}

/**
 * Interacts with the localstorage API - primarily used by React context for persisting data through refreshes
 * @function calcuttaStore
 * @param {string} action 
 * @param {string} key 
 * @param {object} data 
 */
const calcuttaStore = (action, key, data) => {
  if (action === 'get') {
    let storageObj = JSON.parse(localStorage.getItem(key));

    return storageObj;
  } else if (action === 'set') {
    localStorage.setItem(key, JSON.stringify(data));

    return true;
  } else if (action === 'clear' && key !== undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.clear();
  }
}

export {
  formatMoney,
  formatTimestamp,
  formatDatestamp,
  formatDateTime,
  calcuttaStore
};