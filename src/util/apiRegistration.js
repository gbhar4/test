/**
 * @author Michael Citro
 * @summary This will allow us to tap into API calls from external Tools and libaries
 * @example window.addEventListener('api.response.getOrderDetails', function(event){ console.log(event.detail) });
 */

import { isClient, isInternetExplorer } from '../routing/routingHelper';

let isBrowser = isClient();
let isIE = isInternetExplorer();

export function apiRegistractionDispatcher (subscriptionType, uri, payload) {
  triggerCustomWindowEvent(`api.${subscriptionType}.${uri}`, payload);
}

export function triggerCustomWindowEvent (eventName, data) {
  if (isBrowser) {
    if (isIE) {
      let event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, false, true, data);
      window.dispatchEvent(event);
    } else if (window.CustomEvent) {
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
  }
}
