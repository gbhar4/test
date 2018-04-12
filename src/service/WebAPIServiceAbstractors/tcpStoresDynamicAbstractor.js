/**
* @module Stores Service Abstractors
*/
import {endpoints} from './endpoints.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {sanitizeEntity} from 'service/apiUtil.js';
import {parseDate, COMPLETE_MONTH} from 'util/parseDate';
// import {calc12Hour} from './R3DynamicAbstractors.js';
import {formatPhone} from 'util/formatPhone';
// import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';
import {BOPIS_ITEM_AVAILABILITY, STORE_TYPES} from 'reduxStore/storeReducersAndActions/stores/stores';

let countriesAndStates = require('service/resources/CountriesAndStates.json');

let previous = null;
export function getTcpStoresAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new TcpStoreDynamicAbstractor(apiHelper);
  }
  return previous;
}

class TcpStoreDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function setFavoriteStore
   * @summary
   * @param {String} storeLocationId - The Id of the store you want to set as your favorite
   * @return On success you will get back { success: true } else you will get back a backend mapped error
  */
  setFavoriteStore (storeLocationId, userId) {
    let payload = {
      header: {
        'Content-Type': 'application/json',
        action: 'add',
        fromPage: 'StoreLocator',
        userId: userId,
        storeLocId: storeLocationId
      },
      body: {}, // DT-27576 - service "needs" empty payload
      webService: endpoints.setFavoriteStore
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getStoreInfoByLocationId
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  getStoreInfoByLocationId (args) {
    let payload = {
      header: {
        stlocId: args.storeLocationId
      },
      body: {
        nearStore: args.getNearby,
        distance: args.maxDistance || 25,
        maxStores: args.maxStoreCount || 5
      },
      webService: endpoints.getStoreInfoByLocationId
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res) || (!res.body.getStoreResponse && !res.body.PhysicalStore)) {
        throw new ServiceResponseError(res);
      }

      let store = args.getNearby && res.body.getStoreResponse.PhysicalStore[0] || res.body.PhysicalStore[0];
      let nearbyStores = args.getNearby && res.body.getStoreLocatorByLatLngResponse.result || [];
      let hoursOfOperation = JSON.parse(store.Attribute[0].displayValue || '{}').storehours || [];
      let currentDate = new Date().getDate();
      let storeType = store.storeType || (store.addressLine && store.addressLine[store.addressLine.length - 1]) || '';

      // Parse Store Info
      let storeFilteredInfo = {
        store: {
          basicInfo: {
            id: store.uniqueID,
            storeName: sanitizeEntity(store.Description[0].displayStoreName),
            address: {
              addressLine1: sanitizeEntity(store.addressLine[0]),
              city: store.city,
              state: store.stateOrProvinceName,
              country: store.country && store.country.trim(),
              zipCode: store.zipCode || store.postalCode
            },
            phone: formatPhone(store.telephone1) || '',
            coordinates: {
              lat: parseFloat(store.latitude),
              long: parseFloat(store.longitude)
            }
          },
          hours: {
            regularHours: [ ],
            holidayHours: [ ],
            regularAndHolidayHours: [ ]
          },
          features: {
            storeType: STORE_TYPES[storeType] || (storeType === 'PLACE' && STORE_TYPES.RETAIL) || '',
            mallType: store.x_mallType,
            entranceType: store.x_entranceType,
            isBopisAvailable: res.body.getStoreResponse && res.body.getStoreResponse.isBopisAvailable
          }
        }
      };

      // Parse Store Hours
      if (hoursOfOperation.length) {
        storeFilteredInfo.store.hours.regularHours = parseStoreHours(hoursOfOperation);
      }

      // Parse Nearby Store Info
      storeFilteredInfo.nearbyStores = args.getNearby && nearbyStores
        .filter((nstore) => nstore.storeUniqueID !== store.uniqueID)
        .map((store) => {
          let currentDate = new Date().getDate();
          let storeInfo = {
            basicInfo: {
              id: store.storeUniqueID,
              storeName: sanitizeEntity(store.storeName),
              address: {
                addressLine1: sanitizeEntity(store.streetLine1),
                city: store.city,
                state: store.state,
                zipCode: store.postalcode
              },
              phone: formatPhone(store.phone) || '',
              coordinates: {
                lat: parseFloat(store.latitude),
                long: parseFloat(store.longitude)
              }
            },
            hours: {
              regularHours: [ ],
              holidayHours: [ ],
              regularAndHolidayHours: [ ]
            },
            features: {
              storeType: (store.storeType === 'PLACE' ? STORE_TYPES.RETAIL : STORE_TYPES[store.storeType]) || '',
              redirectURL: `${cleanStr(store.storeName)}-${cleanStr(store.city)}-${cleanStr(store.streetLine1)}-${store.state}-${store.storeUniqueID}`
            }
          };

          // Parse Nearby Store Hours
          if (store.storehours.storehours) {
            storeInfo.hours.regularHours = parseStoreHours(store.storehours.storehours);
          }

          return storeInfo;
        });
      return storeFilteredInfo;
    })
    .catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getStoresByLatLng
   * @summary given a lat and lng, and an optional radius, this will get all stores in the given area
  */
  getStoresByLatLng (coordinates, limit, radius) {
    let payload = {
      header: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        radius: radius || 75,
        maxItems: limit
      },
      body: {
      },
      webService: endpoints.findStoresbyLatitudeandLongitude
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      // unknown structure of response may be nested arrays, may not be nested arrays. all depends on how backend is feeling today.
      let stores = (res.body.PhysicalStore && res.body.PhysicalStore[0] && (res.body.PhysicalStore[0].uniqueId || res.body.PhysicalStore[0].uniqueID))
        ? res.body.PhysicalStore
        : res.body.PhysicalStore && res.body.PhysicalStore[0] || [];

      if (stores.length <= 0) {
        throw new ServiceResponseError({
          body: {
            errorCode: 'NO_STORES_FOUND'
          }
        });
      }

      return stores.map((store) => storeAPIParser(store));
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getTCPStoresByCountry
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69174789/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getStoresByCountry_v2.docx
  */
  getTCPStoresByCountry (country) {
    let payload = {
      header: {
        country: country
      },
      webService: endpoints.getStoreLocationByCountry
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let stateMapping = {};
      let countryCode = (country === 'canada') ? 'CA' : 'US';

      for (let store of res.body.PhysicalStore) {
        if (!stateMapping[store.stateOrProvinceName]) {
          stateMapping[store.stateOrProvinceName] = [];
        }
        stateMapping[store.stateOrProvinceName].push({
          'basicInfo': {
            'id': (store.uniqueID || '').trim(),
            'storeName': (store.Description && store.Description[0] && store.Description[0].displayStoreName) || '',
            'address': {
              'addressLine1': (store.addressLine && store.addressLine[0]) || '',
              'city': store.city || '',
              'state': store.stateOrProvinceName || '',
              'zipCode': (store.postalCode || '').trim()
            },
            'phone': store.telephone1 ? formatPhone(store.telephone1.trim()) : ''
          }
        });
      }

      let countryStores = Object.keys(stateMapping).sort().map((stateId) => {
        // Backend does not have the full state name store so we must map them localy
        let state = countriesAndStates.countriesStatesTable[countryCode].find((state) => state.id === stateId);
        return {
          id: stateId,
          displayName: state ? state.fullName : stateId,
          storesList: stateMapping[stateId]
        };
      });

      return countryStores;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /** @function getFullStoresList
  *   @summary runs the getTCPStoresByCountry for both US and CA
  */
  getFullStoresList () {
    return this.getTCPStoresByCountry('united states').then((usStores) => {
      return this.getTCPStoresByCountry('canada').then((caStores) => {
        return {
          usStores: usStores,
          caStores: caStores
        };
      });
    });
  }

  /**
   * @function getBopisStoresInCartPlusInventory
   * @param {String} skuId - The id of a product you want to check the stores for.
   * @summary This will return a list of stores you have selected in your cart along with inventory for a selected item
  */
  getBopisStoresInCartPlusInventory (skuId, quantity) {
    let payload = {
      header: {
        catentryId: skuId
      },
      webService: endpoints.getUserBopisStores
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let stores = res.body.response;
      return stores.map((store) => storeAPIParser(store, {requestedQuantity: quantity}));
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getBopisStoresInCart
   * @summary This will return a list of stores you have selected in your cart along with inventory for a selected item
  */
  getBopisStoresInCart () {
    let payload = {
      webService: endpoints.getUserBopisStores
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let stores = res.body.response;
      return stores.map((store) => storeAPIParser(store));
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getFavoriteStore
   * @summary This will get a users favorite store that is saved on their account
   * @return empty object if you do not have a favorit store else you will get back
   * {
        id: 123456789,
        storeName: 'Jersey Garden Mall',
        address: {
          addressLine1: '123 ,
          city: 'Jersey City',
          state: 'NJ,
          zipCode: 07047
        },
        phone: '2012336989',
        coordinates: {
          lat: -40,
          long: -70
        }
      }
  */
  getFavoriteStore () {
    let payload = {
      header: {
        action: 'get'
      },
      webService: endpoints.getFavoriteStore
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      if (res.body.displayValue) {
        let store = {
          ...res.body,
          preferredStore: true,
          storehours: JSON.parse(res.body.displayValue)
        };

        return storeAPIParser(store);
      }

      return null;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getStoresPlusInventorybyLatLng
   * @summary This will get Store and Product Inventory Info
  */
  getStoresPlusInventorybyLatLng (skuId, quantity, distance, lat, lng, country) {
    let countryCode = ((!country || country === undefined) || country === 'PR' || country === 'pr') ? 'US' : country;
    let payload = {
      header: {
        latitude: lat,
        longitude: lng,
        catentryId: skuId,
        country: countryCode,
        sType: 'BOPIS'
      },
      body: {
        latitude: lat,
        longitude: lng,
        catentryId: skuId,
        distance: distance || 75,
        country: countryCode,
        sType: 'BOPIS'
      },
      webService: endpoints.getStoreandProductInventoryInfo
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let stores = res.body.result;
      return stores.map((store) => storeAPIParser(store, {requestedQuantity: quantity}));
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

}

  /** @function storeAPIParser
  *   @summary This is the main function that should be used when trying to parse backends apis that return store information
  *   @param {Object} store - The store object exactly how backend sends it in their API
  *   @param {Object} configs - options to apply, somtimes we want some conditionaly set values
  *   @param {Number} configs.requestedQuantity - if passed this will affect a store's product status flag if not passed we will take the as its status from the API, (itemAvailability.qty < requestedQuantity) ? AVAILABILITY.UNAVAILABLE : AVAILABILITY.OK
  */
function storeAPIParser (store, configs = { requestedQuantity: 0 }) {
  let {requestedQuantity} = configs;
  let currentDate = new Date().getDate();
  let hoursOfOperation;
  let addressLine;
  let storeType;

  // Sometimes addressLine is returned as an array
  // Sometimes addressLine is returned as an object with numerical properties (WHY???)
  // If addressLine is object, convert to array
  if (store.addressLine && typeof store.addressLine === 'object' && !Array.isArray(store.addressLine)) {
    addressLine = Object.keys(store.addressLine).map(key => store.addressLine[key]);
  }

  // Sometimes storeType is explicitly defined
  // Sometimes storeType needs to be determined using address
  storeType = store.storeType || (addressLine && addressLine[addressLine.length - 1]) || store.address3 || '';

  // Backend's API structure for stores are never the same, so i am checking a few differant places for store hours
  if (store.storehours) {
    hoursOfOperation = store.storehours.storehours;
  } else if (store.Attribute && store.Attribute[0]) {
    hoursOfOperation = JSON.parse(store.Attribute[0].displayValue || '{}').storehours;
  } else if (store.attribute) {
    hoursOfOperation = JSON.parse(store.attribute.displayValue || '{}').storehours;
  }

  // Parse Store Info
  let storeFilteredInfo = {
    distance: store.distance ? parseFloat(store.distance).toFixed(2) : (store.distanceFromUserToStore ? parseFloat(store.distanceFromUserToStore).toFixed(2) : null),
    basicInfo: {
      id: (store.uniqueID || store.uniqueId || store.storeLocId || store.storeUniqueID || store.stLocId).toString(),
      storeName: sanitizeEntity((store.description && store.description.displayStoreName) || (store.Description && store.Description[0] && store.Description[0].displayStoreName) || store.storeName || store.name || ''),
      isDefault: store.preferredStore,
      address: {
        addressLine1: sanitizeEntity(store.address1 || store.streetLine1 || (store.addressLine && store.addressLine[0])),
        city: store.city,
        state: store.stateOrProvinceName || store.state,
        country: store.country,
        zipCode: store.zipCode || store.postalCode || store.postalcode || store.zipcode
      },
      phone: formatPhone(store.telephone1 || store.phone || store.phone1) || '',
      coordinates: {
        lat: parseFloat(store.latitude),
        long: parseFloat(store.longitude)
      }
    },
    hours: {
      regularHours: [ ],
      holidayHours: [ ],
      regularAndHolidayHours: [ ]
    },
    features: {
      storeType: STORE_TYPES[storeType] || (storeType === 'PLACE' && STORE_TYPES.RETAIL) || '',
      mallType: store.x_mallType,
      entranceType: store.x_entranceType
    },
    productAvailability: store.itemAvailability && store.itemAvailability[0]
      ? {
        skuId: store.itemAvailability[0].itemId,
        status: (store.itemAvailability[0].qty < requestedQuantity)
          ? BOPIS_ITEM_AVAILABILITY.UNAVAILABLE
          : (store.itemAvailability[0].itemStatus === 'AVAILABLE')
            ? BOPIS_ITEM_AVAILABILITY.AVAILABLE
            : (store.itemAvailability[0].itemStatus === 'UNAVAILABLE')
              ? BOPIS_ITEM_AVAILABILITY.UNAVAILABLE
              : BOPIS_ITEM_AVAILABILITY.LIMITED,
        quantity: store.itemAvailability[0].qty
      }
      : {}
  };

  // Parse Store Hours
  if (hoursOfOperation && hoursOfOperation.length) {
    storeFilteredInfo.hours.regularHours = parseStoreHours(hoursOfOperation);
  }

  return storeFilteredInfo;
}

function cleanStr (str) {
  return str.replace(/-| |\./g, '');
}

export function parseStoreHours (hoursOfOperation) {
  let carryOverClosingHour;
  let result = [];
  for (let day of hoursOfOperation) {
    // store was opened on the previous date and closing today,
    // so we need to push it as the first opening time of today
    if (carryOverClosingHour) {
      let date = carryOverClosingHour.split(' ')[0];
      day.availability.unshift({
        from: date + ' 00:00:00',
        to: carryOverClosingHour
      });
      carryOverClosingHour = null;
    }

    let parsableFromDate = day.availability[0].from.replace('T', ' ');
    let parsableToDate = day.availability[day.availability.length - 1].to.replace('T', ' ');
    let fromDate = parseDate(parsableFromDate);
    let toDate = parseDate(parsableToDate);

    let storeHours = {
      dayName: day.nick.toUpperCase() || '',
      openIntervals: day.availability.map((availability) => {
        let parsableFromDate = availability.from.replace('T', ' ');
        let parsableToDate = availability.to.replace('T', ' ');
        let fromDate = parseDate(parsableFromDate);
        let toDate = parseDate(parsableToDate);
        let isSameDay = fromDate.getFullYear() === toDate.getFullYear() && fromDate.getMonth() === toDate.getMonth() && fromDate.getDate() === toDate.getDate();

        if (!isSameDay) {
          // save carry over for next day
          carryOverClosingHour = parsableToDate;
          // set closing hour at 23.59.59 of today
          parsableToDate = fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate() + ' 23:59:59';
        }

        return {
          fromHour: parsableFromDate,
          toHour: parsableToDate
        }
      }),
      isClosed: day.availability[0].status === 'closed'
    };

    result.push(storeHours);
  }

  return result;
}