/**
 * @function
 * @description Returns a formatted string representing US dollars
 * @param {Number} value 
 * @returns {String}
 */
const formatMoney = (value) => {
  let symbol;
  value = isNaN(value) ? 0 : value;
  value = parseFloat(+value);

  let moneyString;
  if (value >= 1000 & value % 1 == 0) {
    moneyString = Math.abs(value).toFixed(0);
  } else {
    moneyString = Math.abs(value).toFixed(2);
  }

  moneyString = moneyString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (value < 0) {
    symbol = '-$';
  } else {
    symbol = '$';
  }

  return `${symbol}${moneyString}`;
}

const formatTimestamp = (value) => {
  let date = new Date(+value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * @function formatDatestamp
 * @param {Date} value 
 * @returns a string representing the passed in date
 */
const formatDatestamp = (value) => {
  if (!value) return null;

  let date = value;

  if (!value instanceof Date && typeof date.toLocaleString == 'function') {
    date = new Date(value);
  }

  return date.toLocaleString();
}

const formatDateTime = (value) => {
  let date = new Date(value);
  let options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit'
  };
  return date.toLocaleDateString(undefined, options);
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

/**
 * @function teamDisplayName - returns a string in the proper team name format
 * @param {String} name 
 * @param {Number} seed 
 * @param {Object} params 
 */
const teamDisplayName = (name, seed, params) => {
  let displayName = '';

  if (name == undefined || name == null) {
    return 'TBD';
  }

  if (seed !== undefined && seed !== null) {
    displayName = '(' + +seed + ') ';
  }

  displayName += name;

  return displayName;
}


/**
 * @typedef {Object} LeaguePathMetadata
 * @property {Number} leagueId - league's unique Id
 * @property {String} menuItem - the top-level menu item key in the leagueNav menu
 * @property {String} subMenuItem - the sub-menu item key (if any)
 */

/**
 * @function parseLeaguePathName
 * @param {String} pathName - the pathName provided by reach router's useLocation hook
 * @returns {LeaguePathMetadata} - an object containing which path, subpath, etc. the user is at
 */
const parseLeaguePathName = (pathName) => {
  // the league path always follows the form: /leagues/{leagueId}/{menuItem}/{subMenuItem}
  // because of the leading forward slash, the 0th entry in the split array will be an empty string
  const components = pathName.replace(/\/{2,}/g, '/').split('/');

  return {
    leagueId: +components[2],
    menuItem: components[3], // will be undefined if at leagueHome
    subMenuItem: components[4] // will be undefined if there is no submenu
  };
}

export {
  formatMoney,
  formatTimestamp,
  formatDatestamp,
  formatDateTime,
  calcuttaStore,
  teamDisplayName,
  parseLeaguePathName
};