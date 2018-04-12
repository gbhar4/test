/**
* @summary adobe DTM tracking hook.
*
* @author Ben
*/
import { triggerCustomWindowEvent } from '../apiRegistration';

export function notifyAdobeDTM (subscriptionType, uri, payload) {
  let currentAction = subscriptionType + '_' + uri;
  if (window._satellite) {
    let webServiceHook = window._satellite.getDataElement('omniture.global.webServiceHook');
    let actionMapper = webServiceHook ? webServiceHook.actionMapper : [];

    if (Array.isArray(actionMapper)) {
      for (let action of actionMapper) {
        if (currentAction === action) {
          window._satellite.setVar(currentAction, payload);
          window._satellite.track(currentAction);
          console.warn('Depreciation:', `If you are seeing this message you are triggering a depreciated function to track events for ${currentAction}. Please add and event listener for the api you are trying to track instead. Refer to apiRegistration.js`);
          break;
        }
      }
    }
  }
}

export function trackProductRecommendations (data) {
  try {
    notifyAdobeDTM('response', 'productRecommendations', data);
  } catch (error) {
    // We dont want tracking issue to throw errors
  }
}

export function trackStyliticsRecommendations (data) {
  try {
    notifyAdobeDTM('response', 'stylitics', data);
  } catch (error) {
    // We dont want tracking issue to throw errors
  }
}

export function triggerPageRenderEvent () {
  triggerCustomWindowEvent('react.app.onPageMount');
  if (window._satellite) {
    window._satellite.track('onPageRenderComplete');
  }
}
