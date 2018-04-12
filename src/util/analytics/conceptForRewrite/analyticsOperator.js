/**
 * @summary This operator is used to trigger tracking functions for our site analytics
 *
 * @author Citro
 */
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {trackEvent} from 'util/analytics/analyticsHelper.js';
import {EVENTS} from './events/events';

let previous = null;
export function getAnalyticsOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new AnalyticsOperator(store);
  }
  return previous;
}

class AnalyticsOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  successfullCheckout () {
    trackEvent(this.store, EVENTS.SUCCESSFULL_CHECKOUT);
  }
}
