/**
@module Global Components Service Abstractors
*/
import {endpoints} from './endpoints.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {parseBoolean} from '../apiUtil';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
// import {sanitizeEntity} from 'service/apiUtil.js';

let previous = null;
export function getGlobalComponentsAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new GlobalComponentsDynamicAbstractor(apiHelper);
  }
  return previous;
}

class GlobalComponentsDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function getEspot
   * @summary This API is used to get an espot given a name as in input, an espot is a marking placeholder engaged through CMC (an IBM tool, for more info see below) for marketing team to push content live on demand.
   * @param {String} espotName - The name of the espot you would like to get
   * @return {String} On successful resolution this will return the markdown from the requested espot, markdown often times is plain HTML. Upon failing we will expect a single error code.
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233473/TCP%20-%20API%20Design%20Specification%20-%20Category-GlobalComponents_getESpot_v2.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-10255
   * @see CMC Details http://www.ibm.com/support/knowledgecenter/SSZLC2_6.0.0/com.ibm.commerce.management-center.doc/concepts/ctfcmc.htm
   */
  getEspot (espotName, isMobile) {
    let payload = {
      header: {
        espotName,
        deviceType: isMobile && 'mobile' || 'desktop'
      },
      webService: endpoints.getESpot
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return res.body.List[0].maketingText;
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getMultiEspotsAndExtraInfo
   * @summary return espot contents and SEO information (mainly it will be used in content pages /us/content/[espot_name])
   * @param {Array<string>} espotsList - the names of the espots to get.
   * @return {Array<Object>} On successful resolution this will return an array of objects holding the markdown from the requested espot and SEO title / description, markdown often times is plain HTML. Upon failing we will expect a single error code.
   * @return res[i].espotName: The name of the espot you requested
   * @return res[i].maketingText: The markdown from the requested espot, markdown often times is plain HTML.
   * @return res[i].espotTitle: Title for the requested espot
   * @return res[i].espotDescription: Description for the requested espot
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233473/TCP%20-%20API%20Design%20Specification%20-%20Category-GlobalComponents_getESpot_v2.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-10255
   * @see CMC Details http://www.ibm.com/support/knowledgecenter/SSZLC2_6.0.0/com.ibm.commerce.management-center.doc/concepts/ctfcmc.htm
   */
  getMultiEspotsAndExtraInfo (espotsList, isMobile) {
    let payload = {
      header: {
        espotName: espotsList.join(','),
        deviceType: (isMobile && 'mobile') || 'desktop',
        type: 'content',
        'Cache-Control': 'no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0
      },
      webService: endpoints.getESpot
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return res.body.List;
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getMultiEspots
   * @summary this method has changed since it's been designed by BE, hence documentation will be outdated // This API is used to get an espot given camma seperated names as in input, an espot is a marking placeholder engaged through CMC (an IBM tool, for more info see below) for marketing team to push content live on demand.
   * @param {Array<string>} espotsList - the names of the espots to get.
   * @return {Array<Object>} On successful resolution this will return an array of objects holding the markdown from the requested espot, markdown often times is plain HTML. Upon failing we will expect a single error code.
   * @return res[i].espotName: The name of the espot you requested
   * @return res[i].maketingText: The markdown from the requested espot, markdown often times is plain HTML.
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233473/TCP%20-%20API%20Design%20Specification%20-%20Category-GlobalComponents_getESpot_v2.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-10255
   * @see CMC Details http://www.ibm.com/support/knowledgecenter/SSZLC2_6.0.0/com.ibm.commerce.management-center.doc/concepts/ctfcmc.htm
   */
  getMultiEspots (espotsList, isMobile, searchTerm) {
    let payload = {
      header: {
        espotName: espotsList.join(','),
        deviceType: (isMobile && 'mobile') || 'desktop'
      },
      webService: endpoints.getESpot
    };

    if (searchTerm) { payload.header.searchTerm = searchTerm; }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return res.body.List;
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getAutoSuggestions
   * @summary This is the autocomplete/type ahead API which is being engaged while searching.
   * @summary For term search you need to do a form submit to {PATH}/shop/SearchDisplay/ given the following input feilds: [storeId='10151 |10152',  catalogId='10551 | 10552',  langId='-1',  pageSize='100',  beginIndex='0',  searchSource='Q',  sType='SimpleSearch',  resultCatEntryType='2',  showResultsPage=true, pageView='image',  custSrch='search']
   * @summary pageSize = max results to display
   * @summary beginIndex = the index of item to start at, set this to 0
   * @summary searchSource = Needs to be ‘Q’
   * @summary sType = can be ‘advancedSearch’ but we don't do that. This value needs to be needs to be ‘SimpleSearch’
   * @summary resultCatEntry = needs to be 2, this maps to products in the backend
   * @summary pageView = needs to be ‘image’
   * @summary custSrch = needs to be ‘search’, this is a flag to tell app server not to cache pages
   * @param {String} term - The word we are searching against. This will be the value of the input that the user is entering into the search field.
   * @param {Integer=} count - The max results we will get back, defults to 5
   * @return {Object} This will resolve with an object holding a terms and categories array.
   * @return {Object[]} terms: This array will have all the suggested terms
   * @return {Object[]} categories: This array will have all the suggested  categories
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233495/TCP%20-%20API%20Design%20Specification%20-%20Category-GlobalComponents_getAutoSuggestions_v2.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-6381
   * @example getAutoSuggestions('Gir', 4).then((res) => {
   [
     {
       heading: 'Suggested Keywords',
      suggestions: [
        {
          text: 'Pants'
        }, {
          text: 'Pants pj'
        }, {
          text: 'Pants pj set'
        }, {
          text: 'Pants set'
        }
      ]
    }, {
      heading: 'Category',
      suggestions: [
        {
          text: 'Pants: Girls > Bottoms',
          url: '#'
        }, {
          text: 'Pants: Boys > Bottoms',
          url: 'http://localhost:9000/'
        }
      ]
    }
    ]
  */
  getAutoSuggestions (term, maxResults = '4', isCancelActiveRequest) {
    let payload = {
      header: {
        // term: term,
        searchTerm: term,
        count: maxResults,
        // coreName: 'MC_10001_CatalogEntry_en_US',
        // coreNameCategory: 'MC_10001_CatalogGroup_en_US',
        // isRest: 'true',
        // rows: '4',
        // start: '0',
        // published: '1',

        resultCount: maxResults || '4',
        timeAllowed: '15000'
      },
      webService: endpoints.getAutoSuggestions
    };

    if (isCancelActiveRequest && this.activeAutoSuggestionsRequest && this.activeAutoSuggestionsRequest.abort) {
      this.activeAutoSuggestionsRequest.abort();
    }

    this.activeAutoSuggestionsRequest = this.apiHelper.webServiceCall(payload);

    return this.activeAutoSuggestionsRequest.then((res) => {
      this.activeAutoSuggestionsRequest = null;

      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

    // Iterate throughthe full response and grab only the data we require
      let terms = (res.body.autosuggestions && res.body.autosuggestions.length > 0) ? Object.keys(res.body.autosuggestions[0].termsArray).slice(0, maxResults).map(
      (key) => ({text: res.body.autosuggestions[0].termsArray[key].term})
    ) || [] : [];

      let categories = (res.body.category && res.body.category.length > 0) ? Object.keys(res.body.category[0].response).slice(0, maxResults).map(
      (key) => ({
        text: res.body.category[0].response[key].catHierarchy,
        url: res.body.category[0].response[key].categoryUrl
      })
    ) || [] : [];

      return [
        {
          heading: 'I\'M LOOKING FOR...',
          suggestions: terms
        }, {
          heading: 'CATEGORY',
          suggestions: categories
        }
      ];
    }).catch((err) => {
      this.activeAutoSuggestionsRequest = null;
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function trackOrder
   * @summary This will return a summary of an order that has been completed.
   * @param {String} orderId - This is the orderId of the order that you would like to get the informaiton about.
   * @param {String} email - This is the users email
   * @return {Object} This will resolve with an object holding the orderId and the tracking number to be displayed to the customer
   * @return trackingNumber: This is the tracking number for the order, null if no tracking number has been created yet
   * @return orderId: This is the orderId that was entered and also needs to be displayed to the user
   * @return pointsEarned: The Points earned for this order
   * @see checkout.reviewOrder, checkout.submitOrder
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/65142787/TCP%20-%20API%20Design%20Specification%20-%20Category-BOPIS_TrackOrderService_v2.docx
   * @example trackOrder('80465046940', 'mikecit22@gmail.com').then((res) => {
   console.log(res) // { trackingNumber:'1ZF54879G7089GD988943' orderId: '80465046940' }
    })
  */
  trackOrder (orderId, email) {
    let payload = {
      header: {
        orderId,
        emailId: email
      },
      webService: endpoints.orderLookUp
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let trackingNumber = res.body.orderLookupResponse.orderDetails.tracking;
      return {
        trackingNumber: (trackingNumber === 'N/A')
        ? null
        : trackingNumber,
        orderId: res.body.orderLookupResponse.orderDetails.orderId,
        pointsEarned: res.body.orderLookupResponse.pointsEarned
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  trackReservation (orderId, email) {
    let payload = {
      body: {
        orderId,
        emailId: email
      },
      webService: endpoints.reservationLookUp
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
   * @function getNavigationTree
   * @summary This will get the global navigation tree with main categories (L1) and its subCategories (L2)
   * @return {Object} Resolves with an Object holding navigationTree, please see below for their structure. Likewise on promise rejection you will get an object with the returned error code.
   * @return res[i].categoryName: This is the text value that will be displayed
   * @return res[i].categoryId: This is the id need for getRecommendations
   * @return res[i].sizeRange: This is the text value of the clothes sizes and ages that this category covers
   * @return res[i].vanityURL: This is the url that the user will be directed to when they click on this category
   * @return res[i].subCategories.subCategoryName: This is the text value that will be displayed
   * @return res[i].subCategories.vanityURL: This is the url that the user will be directed to when they click on this L2
   * @see Related Jira Tasks
   * @see https://childrensplace.atlassian.net/browse/DT-6423
   * @example getNavigationTree().then((res) => {
    console.log(res);
    [
        {
        categoryId: "61533"
        description: "&amp;nbsp;"
        primaryEspot: "headerNavPrimaryEspot_61533"
        secondaryEspot: "headerNavSecondaryEspot_61533"
        selected: false
        title: "Accessories"
        url: "http://int3.childrensplace.com/shop/us/c/kids-accessories-us"          "subCategories": [
                {
                    "name": "newborn girls",
                    "url": "http://int3.childrensplace.com/shop/us/search/kids-accessories-us/newborn-clothes-girls-accessories"
                },
                {
                    "name": "baby boy",
                    "url": "http://int3.childrensplace.com/shop/us/search/kids-accessories-us/baby-boy-clothes-accessories"
                },
                {
                    "name": "baby girl",
                    "url": "http://int3.childrensplace.com/shop/us/search/kids-accessories-us/baby-girls-accessories"
                },
                {
                    "name": "boy",
                    "url": "http://int3.childrensplace.com/shop/us/search/kids-accessories-us/boys-accessories"
                },
                {
                    "name": "girl",
                    "url": "http://int3.childrensplace.com/shop/us/search/kids-accessories-us/girl-accessories"
                },
                {
                    "name": "newborn boys",
                    "url": "http://int3.childrensplace.com/shop/us/search/kids-accessories-us/newborn-clothes-boys-accessories"
                }
            ]
        }
    ]
    })
  */
  getNavigationTree () {
    let payload = {
      header: {
        depthAndLimit: '-1,-1,0'
      },
      webService: endpoints.getHeaderService
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return res.body.catalogGroupView
        .map((L1) => ({
          title: L1.name,
          categoryId: L1.uniqueID,
          description: L1.shortDescription,
          url: L1.seoURL || `/${this.apiHelper.configOptions.siteId}/c/${L1.seo_token_ntk || L1.uniqueID}`,
          selected: false,
          primaryEspot: null, // FIXME:
          secondaryEspot: null, // FIXME:
          menuItems: L1.catalogGroupView
          ? [L1.catalogGroupView
            .map((L2) => ({
              name: L2.name,
              url: L2.seoURL || `/${this.apiHelper.configOptions.siteId}/c/${L2.seo_token_ntk || L2.uniqueID}`,
              categoryId: L2.uniqueID || L2.seo_token_ntk,
              menuItems: L2.catalogGroupView ? L2.catalogGroupView.map((L3) => ({
                name: L3.name,
                url: L3.seoURL || `/${this.apiHelper.configOptions.siteId}/c/${L3.seo_token_ntk || L3.uniqueID}`,
                categoryId: L3.uniqueID || L3.seo_token_ntk
              })) : []
            }))]
          : [[{name: 'NO_DATA', url: '#', categoryId: '#'}]]
        }));
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getCountriesList
   * @summary This is the API to use when you are wanting to change the users ship-to-address in the global header. This will return a list of countries, their country codes and other information need to change a users ship-to-address.
   * @return {Object} Resolves with an Object holding country lists, please see below for their structure. Likewise on promise rejection you will get an object with the returned error code.
   * @return cuntryCode: This is the code required to send in the User API updateShippingCountry for cuntryCode
   * @return countryName: This is the text value that will be displayed to the user as a country option
   * @return currencyCode: This is the code required to send in the User API updateShippingCountry for currencyCode
   * @return currencyName: is is the text value that will be displayed to the user as a currencyName to select
   * @return exchangevalue: This is the code required to send in the User API updateShippingCountry for exchangevalue
   * @return merchantMargin: This is the code required to send in the User API updateShippingCountry for merchantMargin
   * @see changeShippingPreferance
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/58949637/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getCountryList_v1.docx
   * @example getCountriesList().then((res) => {
    {
      countriesMap: [
        {
          id: 'us',
          displayName: 'United States',
          siteId: 'us_site',
          currencyId: 'usd',
          disallowOtherCurrencies: true
        }, {
          id: 'can',
          displayName: 'Canada',
          siteId: 'can_site',
          currencyId: 'cad',
          disallowOtherCurrencies: true
        }
      ],
      currenciesMap: [
        {
          id: 'usd',
          displayName: 'Dollars',
          exchangevalue: '84.9241000000',
          merchantMargin: '1.0000000000'
        }, {
          id: 'cad',
          displayName: 'Canada Dollar',
          exchangevalue: '84.9241000000',
          merchantMargin: '1.0000000000'
        }, {
          id: 'eur',
          displayName: 'Euros',
          exchangevalue: '84.9241000000',
          merchantMargin: '1.0000000000'
        }, {
          id: 'ars',
          displayName: 'Argentina Peso',
          exchangevalue: '84.9241000000',
          merchantMargin: '1.0000000000'
        }, {
          id: 'cop',
          displayName: 'Colombia Peso',
          exchangevalue: '84.9241000000',
          merchantMargin: '1.0000000000'
        }
      ]
    }
    })
  */
  getCountriesList () {
    let payload = {
      webService: endpoints.getCountryList
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let countryData = res.body.countryData;

    // US and CA are not coming from backend. They said we need to append it at the top from front end.
      let countriesMap = [
        {
          id: 'US',
          displayName: 'United States',
          siteId: 'us',
          currencyId: 'USD',
          disallowOtherCurrencies: true
        },
        {
          id: 'CA',
          displayName: 'CANADA',
          siteId: 'ca',
          currencyId: 'CAD',
          disallowOtherCurrencies: true
        }
      ];
      let currenciesMap = [
        {
          id: 'USD',
          displayName: 'Dollars',
          // Note: next four lines have hard-coded values as prer backend request
          exchangevalue: '1.0',
          merchantMargin: '1.0',
          quoteId: '',
          exchangeRoundMethod: ''
        }, {
          id: 'CAD',
          displayName: 'Canada Dollar',
          exchangevalue: '1.0',
          merchantMargin: '1.0',
          quoteId: '',
          exchangeRoundMethod: ''
        }
      ];

      let processedCurrencies = {USD: true, CAD: true};      // a hash-table of currency codes that we already processed
      for (let country of countryData) {
        countriesMap.push({
          id: country.countryCode,
          displayName: country.countryName,
          siteId: country.countryCode === 'CA'
          ? 'ca'
          : 'us', // would be better if these values can be ENUMS these are also used as keys for the sitesTable in the session redux store
          currencyId: country.currency.currencyCode,
          disallowOtherCurrencies: false // currently hard coded due to no value from backend
        });

      // push the currency of this country into the currenciesMap.
      // note that we check if the currency is not already present, since backend tends to assign
      // the same currency (usually USD) to multiple countries (i.e., unlike the real world)
        if (!processedCurrencies[country.currency.currencyCode]) {
          processedCurrencies[country.currency.currencyCode] = true;
          currenciesMap.push({
            id: country.currency.currencyCode,
            displayName: country.currency.currencyName,
            exchangevalue: country.exchangeRate.exchangevalue,
            merchantMargin: country.exchangeRate.merchantMargin,
            quoteId: country.exchangeRate.quoteId,
            exchangeRoundMethod: country.exchangeRate.exchangeRoundMethod
          });
        }
      }

      return {countriesMap, currenciesMap};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getFooterLinks
   * @summary This will return a static json, this does not make an API call to get footer links, beacuse there is not any.
   * @return {Object[]} See below for the structure
   */
  getFooterLinks (isGuest, isRemembered) {
    let nameSufix = ((isGuest && !isRemembered && 'G' + 'uest') || (isRemembered && 'Rem' + 'embered') || ('Reg' + 'istered')) + this.apiHelper.configOptions.siteId.toUpperCase();

    let footerNavigation = require('./../resources/footerNavigation/footerNavigation' + nameSufix + '.json');
  // let footerNavigation = require('./../resources/footerNavigation.json'); // nodejs mode
    return Promise.resolve(footerNavigation);
  }

  /** no longer used on TCP **/
  submitAutoSuggestionForm (term) {
    return new Promise((resolve) => {
      let baseURL = this.apiHelper.configOptions.assetHost + '/shop/SearchDisplay?';
      let request = {
        searchTerm: term,
        storeId: this.apiHelper.configOptions.storeId,
        catalogId: this.apiHelper.configOptions.catalogId,
        langId: this.apiHelper.configOptions.langId,
        pageSize: 100, // max results to display
        beginIndex: 0, // the index of item to start at, set this to 0
        searchSource: 'Q', // Needs to be ‘Q’
        sType: 'SimpleSearch', // can be ‘advancedSearch’ but we don't do that. This value needs to be needs to be ‘SimpleSearch’
        resultCatEntry: 2, // needs to be 2, this maps to products in the backend
        showResultsPage: true,
        pageView: 'image', // needs to be ‘image’
        custSrch: 'search' // needs to be ‘search’, this is a flag to tell app server not to cache pages
      };
      let requstString = Object.keys(request).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(request[key]);
      }).join('&');
      window.location.href = baseURL + requstString;
      resolve();
    });
  }

  /**
  * @function getApplicationKillSwitches
  */
  getApplicationKillSwitches () {
    let payload = {
      webService: endpoints.applicationKillSwitches
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let applicationSettings = {
//        isBopisEnabled: true,
        isGiftOptionsEnabled: true
      };

      // FIXME: change this long if-else ladder into a lookup table.
      for (let killSwitch of res.body.xAppAttrValues) {
        if (killSwitch.key === 'GIFTOPTION_ENABLED') {
          applicationSettings.isGiftOptionsEnabled = killSwitch.value === '1';
        // } else if (killSwitch.key === 'BOPIS_ENABLED' || killSwitch.key === 'BOPIS_STATE_ENABLED') {
        //   applicationSettings.isBopisEnabled = applicationSettings.isBopisEnabled && parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'BOPIS_ENABLED_CLEARANCE_PRODUCTS') {
          applicationSettings.isBopisClearanceProductEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'GIFTOPTION_ENABLED') {
          applicationSettings.isGiftOptionsEnabled = killSwitch.value === '1';
        } else if (killSwitch.key === 'ADSPLCC') {
          applicationSettings.isPLCCPaymentEnabled = killSwitch.value === '1';
        } else if (killSwitch.key === 'MAX_GIFTCARD') {
          applicationSettings.maxGiftCards = parseInt(killSwitch.value) || 5;
        } else if (killSwitch.key === 'BOPIS_MIXCART_CC_ENABLED') {
          applicationSettings.isCcEnabledForMixCart = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'BOPIS_MIXCART_GC_ENABLED') {
          applicationSettings.isGcEnabledForMixCart = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'BOPIS_MIXCART_PLCC_ENABLED') {
          applicationSettings.isPlccEnabledForMixCart = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'BOPIS_MIXCART_PAYPAL_ENABLED') {
          applicationSettings.isPaypalEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_WIC_ENABLED') {
          applicationSettings.isWICEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_OLPS_ENABLED') {
          applicationSettings.isOLPSEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_WIC_MOBILE_ENABLED') {
          applicationSettings.isWICMobileEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_OLPS_MOBILE_ENABLED') {
          applicationSettings.isOLPSMobileEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'BOPIS_ENABLED_STATES') {
          applicationSettings.bopisEnabledStates = killSwitch.value.split('|');
        } else if (killSwitch.key === 'ROPIS_ENABLED') {
          applicationSettings.isRopisEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ROPIS_MARKETING_PROMO_BOX_ENABLED') {
          applicationSettings.isRopisMktPromoBoxEnabled = killSwitch.value === '1';
        } else if (killSwitch.key === 'ROPIS_ENABLE_SMS') {
          applicationSettings.isRopisSmsEnabled = killSwitch.value === '1';
        } else if (killSwitch.key === 'ROPIS_ORDER_RESERVATION_LIMIT_PER_DAY') {
          applicationSettings.maxRopisReservation = parseInt(killSwitch.value) || 5;
        } else if (killSwitch.key === 'FREE_SHIP_CODE_PRICE_VALUES') {
          applicationSettings.freeShipCodePriceValue = killSwitch.value.split('|');
        } else if (killSwitch.key === 'COUPON_THRESHOLD') {
          applicationSettings.isCouponThreshold = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ORDER_THRESHOLD') {
          applicationSettings.ordersNotificationsThreshold = parseInt(killSwitch.value);
        } else if (killSwitch.key === 'BOPIS_ORDER_RESERVATION_LIMIT') {
          applicationSettings.maxBopisReservation = parseInt(killSwitch.value) || 5;
        } else if (killSwitch.key === 'GIFT_CARD_RECAPTCHA_ENABLED') {
          applicationSettings.isRecapchaEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_WIC_SESSION_TIMEOUT_VALUE') {
          applicationSettings.wicSessionTimeOut = parseInt(killSwitch.value);
        } else if (killSwitch.key === 'MY_ACCOUNT_NODE_ENABLED') {
          applicationSettings.isMyAccountNodeEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_WIC_MOBILE_ENABLED') {
          applicationSettings.isAdsWicMobileEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'ADS_OLPS_MOBILE_ENABLED') {
          applicationSettings.isAdsOlpsMobileEnabled = parseBoolean(killSwitch.value);
        } else if (killSwitch.key === 'COMMUNICATION_PREFERENCE_ENABLED') {
          applicationSettings.isCommunicationPreferencesEnabled = parseBoolean(killSwitch.value);
        }
      }

      return applicationSettings;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}
