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

export {
  formatMoney,
  formatTimestamp,
  formatDatestamp,
  formatDateTime
};