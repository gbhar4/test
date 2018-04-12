import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';

let previous = null;
export function getAnalyticsDictionary (store) {
  if (!previous || previous.store !== store) {
    previous = new AnalyticsDictionary(store);
  }
  return previous;
}

class AnalyticsDictionary {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get eVar1 () {
    return cartStoreView.getCartItems(this.store.getState());
  }

  generateTrackingObject (trackingString, isEvent) {
    if (typeof trackingString !== 'string') {
      console.warn('trackingString argument must be a string');
      return {};
    }
    let trackingObject = {
      [isEvent ? 'linkTrackEvents' : 'linkTrackVars']: trackingString.replace(/ /g, '')
    };

    for (let trackingVar of trackingString.split(',')) {
      if (!this[trackingVar]) {
        console.warn(`${trackingVar} is not defined in the data dictionary!`);
      }
      trackingObject[trackingVar] = this[trackingVar];
    }
    return trackingObject;
  }

}
