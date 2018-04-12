/** @module apiHelper
 * Exports an object which provides common functionality for the different dynamic service abstractors.
 *
 * @author Mike Citro
 * @author Ben
 */
import superagent from 'superagent';
import {ServiceError} from '../ServiceError';
import {routingConstants} from 'routing/routingConstants';
import {domainMapping} from 'routing/domainMapping';
import {webServiceSubscriber} from './webServiceSubscriber';
import invariant from 'invariant';
import {isClient} from 'routing/routingHelper';

// import {CancelableRequestPromise} from 'util/promise/CancelableRequestPromise.js';

// Redux Form needs this as _error
const GLOBAL_ERROR = '_error';
const ERRORS_MAP = require('./errorMapping.json');

const US_CONFIG_OPTIONS = {
  proto: routingConstants.sitesInfo.proto,
  MELISSA_KEY: routingConstants.MELISSA_KEY,
  storeId: routingConstants.sitesInfo.storeIdUS,
  catalogId: routingConstants.sitesInfo.catalogIdUS,
  isUSStore: true,
  langId: '-1'
};

const CA_CONFIG_OPTIONS = {
  proto: routingConstants.sitesInfo.proto,
  MELISSA_KEY: routingConstants.MELISSA_KEY,
  storeId: routingConstants.sitesInfo.storeIdCA,
  catalogId: routingConstants.sitesInfo.catalogIdCA,
  isUSStore: false,
  langId: '-1'
};

// siteId is a mandatory parameter
export function getApiHelper (siteId, domain, cookie, isMobile) {
  siteId = siteId.toLowerCase();
  invariant(siteId === routingConstants.siteIds.us || siteId === routingConstants.siteIds.ca,
    `getApiHelper: invalid siteId '${siteId}'`);
  return new ApiHelper(siteId, domain, cookie, isMobile);
}

class ApiHelper {
  constructor (siteId, domain, cookie, isMobile) {
    let basicConfig = siteId === routingConstants.siteIds.us ? US_CONFIG_OPTIONS : CA_CONFIG_OPTIONS;
    this._configOptions = {
      ...basicConfig,
      siteId: siteId,
      assetHost: domainMapping[domain] ? domainMapping[domain].assetsHost : domainMapping['default'].assetsHost,
      domain: domainMapping[domain] ? domainMapping[domain].apiDomain : domainMapping['default'].apiDomain,
      apiKeys: domainMapping[domain] ? domainMapping[domain].apiKeys : domainMapping['default'].apiKeys,
      cookie: cookie,
      isMobile: isMobile
    };
  }

  /**
  @function returns default config options needed for APIs. Currently these are hard
            coded but this should be picked up dynamicaly through some .env f
  */
  get configOptions () {
    return this._configOptions;
  }

  /**
  @function hits a given endpoint appending data. If this is called and the object has not received a token then this function will make the request for a token in parallel
  */
  webServiceCall (args) {
    if (!args.webService) {
      return;
      // throw ({message: 'apiHelper.webServiceCall: You Have Not Supplied A Web Service Object As Part Of The args'});
    }

    if (args.webService.legacy) {
      return this.legacyServiceCall(args);
    }

    let reqSetting = {
      catalogId: this.configOptions.catalogId,
      langId: this.configOptions.langId,
      storeId: this.configOptions.storeId,
      deviceType: this.configOptions.isMobile ? 'mobile' : 'desktop',
      'Cache-Control': 'no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0
    };

    if (this.configOptions.cookie && !isClient()) {
      reqSetting['Cookie'] = this.configOptions.cookie;
    }

    // console.log(this._configOptions.proto + this._configOptions.domain + args.webService.URI);
    let requestType = args.webService.method.toLowerCase();
    let request = superagent[requestType](this._configOptions.proto + this._configOptions.domain + args.webService.URI)
    .withCredentials()
    .set(reqSetting)
    .accept('application/json')
    .timeout({
      response: 30000,  // Wait 30 seconds for the server to start sending,
      deadline: 40000 // but allow 40 seconds for the file to finish loading.
    });

    if (args.header) {
      request.set(args.header);
    }

    // make the api call
    if (requestType === 'get') {
      request.query(args.body);
    } else {
      request.send(args.body);
    }

    let result = new Promise((resolve, reject) => {
      request
      .then((response) => {
        resolve(response);

        webServiceSubscriber.notifyServiceResponse({
          request: {
            body: args.body,
            header: args.header,
            settings: reqSetting
          },
          response: response.body
        }, args.webService.URI);
      })
      .catch((err) => {
        reject(err);

        webServiceSubscriber.notifyServiceResponse({
          request: {
            body: args.body,
            header: args.header,
            settings: reqSetting
          },
          response: err.response && err.response.body
        }, args.webService.URI);
      });
    });
    result.abort = () => request.abort();     // allow callers to cancel the request by calling abort on the returned object.

    return result;
  }

  legacyServiceCall (args) {
    let body = {
      ...args.body,
      catalogId: this.configOptions.catalogId,
      langId: this.configOptions.langId,
      storeId: this.configOptions.storeId
    };

    let requestType = args.webService.method.toLowerCase();
    let request = superagent[requestType](args.webService.URI).accept('application/json');

    if (args.header) {
      request.set(args.header);
    }

    // make the api call
    if (requestType === 'get') {
      request.query(body);
    } else {
      request.send(body);
    }

    let result = new Promise((resolve, reject) => {
      request
      .then((response) => {
        resolve(response);

        webServiceSubscriber.notifyServiceResponse({
          request: {
            body: args ? args.body : {},
            header: args ? args.header : {}
          },
          response: response.body
        }, args.webService.URI);
      })
      .catch((err) => {
        reject(err);

        webServiceSubscriber.notifyServiceResponse({
          request: {
            body: args ? args.body : {},
            header: args ? args.header : {}
          },
          response: err.body
        }, args.webService.URI);
      });
    });
    result.abort = () => request.abort();     // allow callers to cancel the request by calling abort on the returned object.

    return result;
  }

  /**
   * @function all service abstractors should use this function when in catch() of promise.
   * Backend does not have a normalized way to send errors so this function does the parsing to send it back in a constent way
  */
  getFormattedError (err) {
    return (err.response) ? getFormattedErrorFromResponse(err.response) : err;
  }

  responseContainsErrors (response) {
    // if (response instanceof Error) {
    //   return true;
    // }

    // Be paranoid and make sure that we can handle a situatioin where response.body is undefined
    if (!response || !response.body) {
      return false;
    }
    let responseBody = response.body;
    return !!(responseBody.errorCode || responseBody.errorMessageKey || responseBody.errorKey ||
      (responseBody.errors && responseBody.errors.length > 0) ||
      (response.body.error && response.body.error.errorCode));
  }

}

function getFormattedErrorFromResponse (response) {
  let errorsList = (Array.isArray(response.body.errors) && response.body.errors) ||
    (response.body.error && response.body.error.errorCode && [{
      errorCode: response.body.error.errorCode,
      errorKey: response.body.error.errorKey,
      errorMessageKey: response.body.error.errorMessageKey,
      errorMessage: response.body.error.errorMessage
    }]) ||
    [{
      errorCode: response.body.errorCode,
      errorKey: response.body.errorKey,
      errorMessageKey: response.body.errorMessageKey,
      errorMessage: response.body.errorMessage
    }];

  let errorCodes = '';
  let errorMessages = {};
  for (let error of errorsList) {
    let errorKey = error.errorKey || error.errorCode || error.errorMessageKey;
    if (ERRORS_MAP[error.errorKey]) {
      errorMessages[ERRORS_MAP[error.errorKey].formFieldName || GLOBAL_ERROR] = ERRORS_MAP[error.errorKey].errorMessage;
    } else if (ERRORS_MAP[error.errorCode]) {
      errorMessages[ERRORS_MAP[error.errorCode].formFieldName || GLOBAL_ERROR] = ERRORS_MAP[error.errorCode].errorMessage;
    } else if (ERRORS_MAP[error.errorMessageKey]) {
      errorMessages[ERRORS_MAP[error.errorMessageKey].formFieldName || GLOBAL_ERROR] = ERRORS_MAP[error.errorMessageKey].errorMessage;
    } else {
       // We send the server error as backup in case we don't have the error in our map, but sometimes backend does not have this either so we default it
      errorMessages[GLOBAL_ERROR] = error.errorMessage || ERRORS_MAP['DEFAULT'].errorMessage;
    }
    errorCodes += (errorCodes ? ', ' : '') + errorKey;
  }

  return new ServiceError(errorCodes, errorMessages, response.status);
}

export const defaultApiHelper = getApiHelper(routingConstants.siteIds.us, 'default');
