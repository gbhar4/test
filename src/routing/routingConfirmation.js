let _routingConfirmation = defaultRoutingConfirmation;

export function routingConfirmation (message, callback) {
  return _routingConfirmation(message, callback);
}

export function setRoutingConfirmation (confirmationMethod) {
  _routingConfirmation = confirmationMethod;
}

function defaultRoutingConfirmation (message, callback) {
  callback(window.confirm(message));
}
