/**
@module vendorDynamicAbstractors
*/
import {endpoints} from './endpoints.js';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {parseBoolean} from 'service/apiUtil.js';
import superagent from 'superagent';
import {isClient} from 'routing/routingHelper';
import {setCookie, readCookie} from 'util/cookieManagement.js';
import {trackProductRecommendations, trackStyliticsRecommendations} from 'util/analytics/adobeDTMTracking';

const ERRORS_MAP = require('service/WebAPIServiceAbstractors/errorMapping.json');

let previous = null;
export function getVendorAbstractors (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new VendorDynamicAbstractors(apiHelper);
  }
  return previous;
}

function sanitizeZipcode (str) {
  let sanitizedStr = (str || '').replace(/\D/g, '');
  if (sanitizedStr.length > 5) {
    sanitizedStr = sanitizedStr.substr(0, 5);
  }

  return sanitizedStr;
}

function sanitizePhoneNumer (str) {
  let sanitizedStr = (str || '').replace(/\D/g, '');
  if (sanitizedStr.length > 10) {
    sanitizedStr = sanitizedStr.substr(sanitizedStr.length - 10);
  }

  return sanitizedStr;
}

class VendorDynamicAbstractors {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function paypalAuthorization
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  paypalAuthorization (orderId, fromPage, paypalPayload, paypalOrderId) {
    let payload = {
      header: {
        tcpOrderId: orderId,
        callingPage: fromPage,
        PaRes: paypalPayload,
        MD: paypalOrderId
      },
      webService: endpoints.paypalAuth
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        success: true
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function startPaypalCheckout
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  startPaypalCheckout (orderId, fromPage) {
    let payload = {
      header: {
        orderId: orderId,
        callingPage: fromPage,
        requestType: 'REST'
      },
      webService: endpoints.paypalLookUp
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        centinelPostbackUrl: res.body.Centinel_ACSURL,
        centinelTermsUrl: res.body.Centinel_TermURL,
        centinelPayload: res.body.Centinel_PAYLOAD,
        centinelOrderId: res.body.Centinel_OrderId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function acceptOrDeclineWIC
   * @summary see DT-19753 for more info
   * @param {type} paramName -
   * @return TDB
  */
  acceptOrDeclineWIC (args) {
    let payload = {
      body: {
        clientHeader: {
          clientName: 'THECHILDRENSPLACE',
          timestamp: new Date() // 2017-01-27T12:41:49.505+05:30
        },
        posType: 'E',
        preScreenId: args.prescreenCode,
        presentationInd: args.accepted ? '1' : '2',
        recordType: 'M',
        storeNumber: '180' // as per backend ADS need these numbers, always the same
      },
      webService: endpoints.acceptOrDeclineWIC
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return res.body;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  acceptOrDeclinePreScreenOffer (args) {
    let payload = {
      body: {
        preScreenId: args.prescreenCode,
        madeOffer: args.accepted ? 'true' : 'false'
      },
      webService: endpoints.processPreScreenOffer
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return res.body;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function preScreenCodeValidation
   * @deprecated: remove method, no longer needed
  */
  preScreenCodeValidation (preScreenId) {
    let payload = {
      body: {
        preScreenId: preScreenId
      },
      webService: endpoints.processPreScreenCodeValidation
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let isValid = parseBoolean(res.body.isValid);

      if (!isValid) {
        throw new ServiceResponseError({
          errorKey: 'INVALID_PRESCREEN_CODE'
        });
      }

      return { isValid };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function instantCreditApplication
   * @summary see DT-20302, DT-19753 for more info, https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/68061177/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_ProcessWIC_v2.docx
   * @param {type} paramName -
   * @return TDB
   * REVIEW: separate into 2 abstractors vs using flag to determine endpoint and content-type
  */
  instantCreditApplication (args) {
    let phoneNumber = sanitizePhoneNumer(args.phoneNumber);
    let altPhoneNumber = sanitizePhoneNumer(args.altPhoneNumber);
    let zipCode = sanitizeZipcode(args.zipCode);

    let payload = {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        firstName: args.firstName,
        lastName: args.lastName,
        middleInitial: args.middleNameInitial || '',
        address1: args.addressLine1,
        address2: args.addressLine2 || '',
        city: args.city,
        state: args.state,
        zipCode: zipCode,
        country: args.country,
        ssn: args.ssn,
        alternatePhoneNumber: altPhoneNumber,
        emailAddress: args.emailAddress,
        birthdayDate: (args.birthMonth.length < 2 ? '0' : '') + args.birthMonth + (args.birthDay.length < 2 ? '0' : '') + args.birthDay + args.birthYear,
        mobilePhoneNumber: phoneNumber,
        BF_ioBlackBox: args.BF_ioBlackBox,
        prescreenId: args.prescreenCode || ''
      },
      webService: args.prescreenCode ? endpoints.prescreenApplication : endpoints.instantCreditApplication
    };

    // We now have pre-screening on express checkout flow. We are to inform backend of this so that can auto apply any promos to the order
    if (args.isExpressCheckout) {
      payload.body.fromPage = 'expressCheckout';
    }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (!res || !res.body) {
        throw new ServiceResponseError(res);
      }

      let body = (res.body && res.body.response) ? res.body.response : res.body;
      let returnCode = body.returnCode || body.errorCode;

      if (body.returnCode) {
        switch (body.returnCode) {
          case '02':
            return {status: 'PENDING'};
          case '04':
            return {status: 'TIMEOUT'};
        }
      }

      // NOTE: DT-28809
      // if (returnCode === '04' || returnCode === '13007') {
      if (returnCode === '13007') {
        throw new ServiceResponseError({
          body: {
            errorKey: 'INVALID_PRESCREEN_CODE'
          }
        });
      }

      if (returnCode !== '01' && returnCode !== '02' && this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let address = body.address;

      return {
        onFileCardId: (body.xCardId || '').toString(),
        cardNumber: body.cardNumber,
        cardType: 'PLACE CARD',
        isExpirationRequired: false,
        isCVVRequired: false,
        isDefault: false,

        address: address && {
          firstName: address.firstName,
          lastName: address.lastName,
          addressLine1: address.address1,
          addressLine2: address.address2,
          zipCode: address.zipCode,
          state: address.state,
          city: address.city,
          country: address.country || 'US'
        },

        emailAddress: args.emailAddress,
        phoneNumber: body.phoneNumber || args.phoneNumber,

        status: body.returnCode === '01' ? 'APPROVED' : 'EXISTING', // error code 03 = EXISTING but if we got to this point we assume! that the status is always exisiting if returnCode !== 1
        creditLimit: parseFloat((body.creditLimit || '').toString().replace(/\$/gi, '')),
        // apr: parseFloat(credit.apr),
        couponCode: body.couponCode,
        savingAmount: parseFloat((body.savingAmount || '').replace(/\$/gi, '')) || 0,
        discount: parseFloat(body.percentOff), // '30%' but we'll need to calculate on it, so parseFloat
        checkoutCouponError: ERRORS_MAP[body.couponError]
      };
    })
    .catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function authToken
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  authToken () {
    let payload = {
      header: {
        client_id: 'd6f956g9c83b6e07968ea6ac7jf45156',
        client_secret: 'c2df466gd626519j90D3E53784A7CS65',
        grant_type: 'CLIENT_CREDENTIALS',
        scope: 'EXT_ACCESS'
      },
      webService: endpoints.authToken
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return 'Bearer ' + res.body.access_token;
    });
  }

  /**
   * @function getOutfitRecommendations
   * @summary This will get outfit recomendations given an items partNumber
   * @param {String} itemPartNumber - this is the item part number backend sends us in any api that sends us product info
   * @param {String} maxResultSet - defaults to 5. this is the max number of recomendations we will get back
   * @see http://widget-api.stylitics.com/index.html#/
  */
  getOutfitRecommendations (itemPartNumber, outfitPageTag, maxResultSet = 20, siteId, outfitId) {
    return superagent.get(this.apiHelper.configOptions.apiKeys.STYLITICS_HOST)
      .query({
        username: this.apiHelper.configOptions.apiKeys.STYLITICS,
        region: siteId && siteId.toUpperCase(),
        total: maxResultSet,
        [outfitPageTag ? 'tags' : 'item_number']: outfitPageTag || itemPartNumber
      }).then((res) => {

        if (res.body[0] && !readCookie('styliticsWidgetSession')) {
          setCookie({ key: 'styliticsWidgetSession', value: res.body[0].session_id, daysAlive: 1 });
        }

        trackStyliticsRecommendations({itemPartNumber, outfitPageTag, maxResultSet, res: res.body});

        return res.body[0]
          ? res.body
            .filter((outfit) => outfit.id.toString() !== outfitId)
              .map((outfit) => ({
                generalProductId: outfit.id.toString(),
                name: null,           // TODO: make sure we have a name
                imagePath: outfit.image_url,
                productIds: outfit.items.map((item) => item.remote_id).join('-')
              }))
          : [];
      });
  }

  /**
   * @function getProductRecommendations
   * @summary This will get product recomendations given an items partNumber
   * @param {String} itemPartNumber - this is the item part number backend sends us in any api that sends us product info
   * @param {String} page (pdp | cart | homepage | plp | favorites | dlp | checkout) - page of the displaying recs
   * @see https://childrensplace.atlassian.net/browse/DT-22779
  */
  getProductRecommendations (itemPartNumber, page, siteId = 'US', categoryName) {
    let mcmid;
    
    if (isClient() && window._satellite) {
      mcmid = window._satellite.getVisitorId().getMarketingCloudVisitorID();
    } else {
      let cookieArr = readCookie('AMCV_9A0A1C8B5329646E0A490D4D@AdobeOrg').split('|');
      mcmid = cookieArr[cookieArr.indexOf('MCMID') + 1];
    }

    return superagent.post('https://tcp.tt.omtrdc.net/rest/v1/mbox?client=tcp')
      .send({
        'mbox': 'target-global-mbox',
        'marketingCloudVisitorId': mcmid || '',
        'requestLocation': {
          'pageURL': isClient() && window.location.href,
          'impressionId': '1',
          'host': 'thechildrensplace'
        },
        'mboxParameters': {
          'entity.categoryId': categoryName || 'not_set',
          'entity.id': (itemPartNumber || 'not_set') + '_' + siteId.toUpperCase(),
          'pageType': page || 'not_set'
        }
      }).then((res) => {
        let recs = JSON.parse(res.body.content || '[]');
        trackProductRecommendations({itemPartNumber, page, siteId, recs});

        let recommendations = recs
          .filter((rec) => rec.availability === 'In Stock')
          .map((rec) => ({
            // ...rec,
            generalProductId: rec.id.replace(/_(US|CA)$/, ''),
            pdpUrl: rec.pdpURL,
            department: rec.department,
            name: rec.name,
            imagePath: rec.imagePath
            // listPrice: Number(rec.listPrice), // do not trust vendor's prices
            // offerPrice: Number(rec.offerPrice) // do not trust vendor's prices
            // isQuickViewEnabled: !!rec.sQuickViewEnabled, //unused
            // availability: rec.availability, //unused
            // inventory: Number(rec.inventory) //unused
          }));

        return this.getProductsPrices(recommendations.map((recommendation) => recommendation.generalProductId)).then((prices) => recommendations.map((recommendation) => {
          return {
            ...recommendation,
            ...prices[recommendation.generalProductId]
          };
        }));
      });
  }

  /*
  * @function getProductsPrices
  * @summary Auxiliar method to retrieve prices for product recommendations. It returns prices for specific product ids
  * @param {Array[String]} productIds - the ids of all the products to get prices for
  */
  getProductsPrices (productIds) {
    let payload = {
      header: {
        partNumber: productIds.join('-')
      },
      webService: endpoints.getPriceDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      // service supposadly returns the response we want,
      // no need for any treatment (to be confirmed)
      return res.body;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function calcDistanceByLatLng
   * @summary
   * @param {type} storeLocations - needs to be an array of objects, each object is {lat: '40', long: '-70'}
   * @param {number} coords - latitude and longitude from where to calculate the distance (optional) if not passed, will resolve to user's lat / lng
   * @return An array of integrers in miles or -1 if there was an error
  */
  calcDistanceByLatLng (storeLocations, coords) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Location services not available'));
      }

      let calculateWithPositionCallback = (pos) => {
        try {
          let origin = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          let destination = [];
          let service = new window.google.maps.DistanceMatrixService();

          // For each sore crate a new google LatLng object
          for (let location of storeLocations) {
            destination.push(new window.google.maps.LatLng(location.lat, location.long));
          }

          let distanceMetrixConfig = {
            origins: [origin],
            destinations: destination,
            travelMode: 'DRIVING',
            unitSystem: window.google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
          };

          // Set the distance api config params and callback
          service.getDistanceMatrix(distanceMetrixConfig,
            (response, status) => {
              // If the Request as a whole was ok return the distances, else reject with proper error
              if (status === 'OK') {
                let results = response.rows && response.rows[0] && response.rows[0].elements;
                resolve(results.map((location) => {
                  return location.status === 'OK' ? (location.distance && `${location.distance.text}.`) : -1;
                }));
              } else {
                // Google API level error, all possible errors listed below
                switch (status) {
                  case 'INVALID_REQUEST':
                    throw new Error('The provided request was invalid. This is often due to missing required fields');
                  case 'MAX_ELEMENTS_EXCEEDED':
                    throw new Error('The product of origins and destinations exceeds the per-query limit.');
                  case 'MAX_DIMENSIONS_EXCEEDED':
                    throw new Error('Your request contained more than 25 origins, or more than 25 destinations.');
                  case 'OVER_QUERY_LIMIT':
                    throw new Error('Your application has requested too many elements within the allowed time period. The request should succeed if you try again after a reasonable amount of time.');
                  case 'REQUEST_DENIED':
                    throw new Error('The service denied use of the Distance Matrix service by your web page.');
                  default:
                    throw new Error('A Distance Matrix request could not be processed due to a server error. The request may succeed if you try again.');
                }
              }
            });
        } catch (err) {
          // try/catch level error, before google api call but after getting users geolocation
          console.log(err);
          resolve(storeLocations.map(() => -1));
        }
      };

      if (coords) {
        calculateWithPositionCallback({
          coords: {
            latitude: coords.lat,
            longitude: coords.lng
          }
        });
      } else {
        navigator.geolocation.getCurrentPosition(calculateWithPositionCallback, (err) => {
          // geolocation level error, user may have it disabled
          console.log(err);
          resolve(storeLocations.map(() => -1));
        });
      }
    });
  }
}
