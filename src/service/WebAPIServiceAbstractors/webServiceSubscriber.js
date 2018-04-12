/**
* @summary This Object is used as a layer of abstraction to register callbacks to service requests and responses.
* the callbacks will get the request/response as an argument.
*
* @author Citro
* @author Ben
*/
import warning from 'warning';
import {endpoints} from 'service/WebAPIServiceAbstractors/endpoints.js';
import ObjectAssignDeep from 'util/object-assign-deep.js';

/** the URI to use for subscribing to all uri's */
export const SUBSCRIBE_TO_ALL_URI = '_ALL_';

let subscriptionId = 0;
let subscriptionTableRequest = {[SUBSCRIBE_TO_ALL_URI]: []};
let subscriptionTableResponse = {[SUBSCRIBE_TO_ALL_URI]: []};
const KNOWN_URIS = getKnownUris(endpoints);

/** the possible values of subscriptions; passed as the first parameter to subscriber callbacks */
export const subscriptionTypes = {
  REQUEST: 'request',
  RESPONSE: 'response'
};

export const webServiceSubscriber = {
  /**
  * @func subscribeForServiceRequest
  * @param uri - The uri of the service to subscribe to.
  * @param callback - The callback to be triggered when a request is made to the service at the given uri. The callback will recieve
  *  three parameters:  the type of the subscription that triggered this call (see subscriptionTypes);
  *                     the uri of the service;
  *                     the payload data sent in the request to the service
  * @summary This is used to register callbacks to outgoing requests. The callback will be given the outgoing request as an argument
  * @return unsubscribeRequest - A function that can be used to unsubscribe the registered callback
  */
  subscribeForServiceRequest: function (uri, callback) {
    return subscribeForService(subscriptionTypes.REQUEST, uri, callback);
  },

  /**
  * @func subscribeForServiceResponse
  * @param uri - The uri of the service to subscribe to.
  * @param callback - The callback to be triggered when a response comes from the service at the given uri. The callback will recieve
  *  three parameters:  the type of the subscription that triggered this call (see subscriptionTypes);
  *                     the uri of the service;
  *                     the payload data sent in the request to the service
  * @summary This is used to register callbacks to the response of a webService call. The callback will be given the response as an argument
  * @return unsubscribeResponse - A function that can be used to unsubscribe the registered callback
  */
  subscribeForServiceResponse: function (uri, callback) {
    return subscribeForService(subscriptionTypes.RESPONSE, uri, callback);
  },

  /**
  * @func notifyServiceRequest
  * @param uri - The uri of the service that was just called.
  * @param request - The request that is going out to the webService.
  * @summary This function will trigger all callbackes to the given serviceName passing in the request as an argument
  */
  notifyServiceRequest: function (request, uri) {
    notifyService(subscriptionTypes.REQUEST, request, uri);
  },

  /**
  * @func notifyServiceResponse
  * @param uri - The uri of the service to subscribe to.
  * @param response - The response that came back from the serviceCall.
  * @summary This function will trigger all callbackes to the given serviceName passing in the response as an argument
  */
  notifyServiceResponse: function (response, uri) {
    notifyService(subscriptionTypes.RESPONSE, response, uri);
  }

};

// ------------------------------- protected code below this line --------------------- //

function getKnownUris (endpoints) {
  let result = {[SUBSCRIBE_TO_ALL_URI]: true};
  for (let index of Object.keys(endpoints)) {
    result[endpoints[index].URI] = true;
  }
  return result;
}

function unsubscribe (subscriptionType, uri, subscriptionId) {
  let subscribers = getSubscribers(subscriptionType);
  subscribers[uri] = subscribers[uri].filter((subscription) => subscription.id !== subscriptionId);
}

function getSubscribers (subscriptionType) {
  return subscriptionType === subscriptionTypes.REQUEST ? subscriptionTableRequest : subscriptionTableResponse;
}

function subscribeForService (subscriptionType, uri, callback) {
  let subscribers = getSubscribers(subscriptionType);
  if (!KNOWN_URIS[uri]) {
    warning(false, `webServiceSubscriber.subscribeForService: Unknown service uri: ''${uri}'', please make sure this is a supported endpoint`);
    return;
  } else if (typeof callback !== 'function') {
    warning(false, `webServiceSubscriber.subscribeForService: expected a callback function, but recieved a parmeter of type '${typeof callback}'`);
    return;
  }
  if (!subscribers[uri]) {     // if there are currently no subscribers for this uri
    subscribers[uri] = [];     // creatre a new empty subscribers list
  }
  subscribers[uri].push({id: subscriptionId, callback: callback});
  subscriptionId++;   // next subsceriber will get a new id

  return unsubscribe.bind(null, subscriptionType, uri, subscriptionId);     // return a method that unsubscribes this subscription
}

function notifyService (subscriptionType, payload, uri) {
  let payloadClone = ObjectAssignDeep({}, payload);     // clone payload so subscribers cannot mutate payload (intentiaonally or by mistake)
  let subscribers = getSubscribers(subscriptionType);
  const EMPTY_ARRAY = [];
  // call all subscribers to this uri, as well as subscribers to all uris
  for (let subscriber of subscribers[SUBSCRIBE_TO_ALL_URI].concat(subscribers[uri] || EMPTY_ARRAY)) {
    try {   // call subscribers inside sandbox
      subscriber.callback(subscriptionType, uri, payloadClone);
    } catch (ex) {
      /* just supress the error -> tracking code should do it's own try-catch if it wants */
    }
  }
}
