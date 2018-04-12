/**
* @summary These are helper function for our tracking analytics code.
*
* @author Citro
*
* @example
*   import {trackEvent} from util/analytics/analyticsHelper.js
*   import {EVENTS} from './events/events';
*
*   trackEvent(this.store EVENTS.SUCCESSFULL_CHECKOUT)
*/
import {isClient} from 'routing/routingHelper';
import {getAnalyticsDictionary} from 'util/analytics/analyticsDictionary.js';
import {EVENTS} from './events/events';

/**
 * @func trackEvent
 * @param {Object} store - referance to the redux store
 * @param {EVENTS} eventType - An attribute of the ./events/events export object
 */
export function trackEvent (store, eventType) {
  let {name, vars, events, isPageLoad} = EVENTS[eventType];
  let dictionary = getAnalyticsDictionary(store);
  let trackingData = dictionary.generateTrackingObject(vars);
  let trackingEvents = dictionary.generateTrackingObject(events, true);
  triggerTrack(name, trackingData, trackingEvents, !!isPageLoad);
}

/**
 * @func triggerTrack
 * @param {Object} name - Must be a unique name. The only side effect of have duplicate names is that you wont be able to byPass this through DTM if there is a production issue
 * @param {Object} data - use the analyticsDictionary.generateTrackingObject function to help build this object
 * @param {Bool} events - use the analyticsDictionary.generateTrackingObject function to help build this object
 * @param {String} isPageLoadEvent - this will trigger a page load event, reflecting as a new page load on the reports.
 */
function triggerTrack (name, data, events, isPageLoadEvent) {
  let omniture = getOmniture();
  let bypassFunction = getBypassFunction(name);

  try {
    if (bypassFunction) {
      return bypassFunction(name, data, events, isPageLoadEvent);
    }

    if (!omniture.linkTrackVars) {
      console.warn('Please make sure to set the linkTrackVars arg as you are not traking any eVars/props');
    }
    Object.assign(omniture, data, events);
    isPageLoadEvent ? omniture.t() : omniture.tl(true, 'o', name);
    return Object.assign(omniture, { linkTrackEvents: '', linkTrackVars: '' });
  } catch (err) {
    console.warn(err);
  }
}

/**
 * @function getOmniture
 * @summary this will get you the omniture library deployed via DTM, or a polyfill in case it is not loaded
 */
function getOmniture () {
  if (isClient() && window.s_c_il && window.s_c_il[1]) {
    let lib = window.s_c_il[1];
    lib.constructor.name !== 'AppMeasurement' && console.warn('DTM MAY HAVE REMOVE THE OMNITURE LIBRARY!');
    return window.s_c_il[1];
  } else {
    console.warn('DTM MAY HAVE REMOVE THE OMNITURE LIBRARY!');
    return {
      t: () => { /* polyfill for page track */ },
      tl: () => { /* polyfill for link track */ }
    };
  }
}

/**
 * @function getBypassFunction
 * @param {String} bypassName - the name of the DTM data element. Please note that the DTM data element must return a function
 * @summary This will allow us to bypass production tracking by hooking into the tracking call via DTM on the fly
 */
function getBypassFunction (bypassName) {
  if (isClient() && window._satellite) {
    if (!bypassName) {
      console.warn('Please make sure to name this tracking action. Without a name we will be unable to by pass this from DTM!');
    }
    return window._satellite.getDataElement(bypassName);
  }
}
