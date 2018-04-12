/**
@module Global Components Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';

export function getGlobalComponentsAbstractor () {
  return GlobalComponentsStaticAbstractor;
}

const GlobalComponentsStaticAbstractor = {
  getEspot: function (espotName) {
    return editJsonPopup('getEspot', `<h4>static moc of espot '${espotName}'</h4>`, espotName);
  },

  getMultiEspotsAndExtraInfo: function (espotsList, isMobile) {
    return editJsonPopup('getMultiEspotsAndExtraInfo',
      espotsList.map((espotName) => ({
        espotName: espotName,
        maketingText: `<h4>static moc of espot '${espotName}'</h4>`,
        seoTitle: 'static title for espot',
        seoMeta: 'static long description for espot'
      })
    ), espotsList);
  },

  getMultiEspots: function (espotsList) {
    return editJsonPopup('getMultiEspots',
      espotsList.map((espotName) => ({
        espotName: espotName,
        maketingText: `<h4>static moc of espot '${espotName}'</h4>`
      })
    ), espotsList);
  },

  getAutoSuggestions: function (term, count) {
    return editJsonPopup('getAutoSuggestions',
      [
        {
          heading: 'I\'M LOOKING FOR...',
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
          heading: 'CATEGORY',
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
      ], {term, count}
    );
  },

  getApplicationKillSwitches: function () {
    return editJsonPopup('getApplicationKillSwitches', {
      isBopisClearanceProductEnabled: false,
      isRopisEnabled: true,
      isGiftOptionsEnabled: true,
      isPLCCPaymentEnabled: true,
      maxGiftCards: 5,
      isPaypalEnabled: true,
      isRecapchaEnabled: true,
      ordersNotificationsThreshold: 6,
      isWICEnabled: true,
      isOLPSEnabled: true,
      isWICMobileEnabled: true,
      isOLPSMobileEnabled: false,
      isCommunicationPreferencesEnabled: false
    });
  },

//  getCountriesListAndNavigationTree: function () {
//   return editJsonPopup('getCountriesListAndNavigationTree', {
//     navigationTree: getNavigationTree(),
//     countryList: getCountriesList()
//   });
// }

  trackOrder: function (orderId, email) {
    return editJsonPopup('trackOrder', {
      trackingNumber: 'USPS-9400 1000 0000 0000 0000 00',
      orderId: 'order#17564456',
      pointsEarned: 40
    }, {orderId, email});
  },

  trackReservation: function (orderId, email) {
    return editJsonPopup('trackReservation', {
      trackingNumber: 'USPS-9400 1000 0000 0000 0000 00',
      orderId: 'order#17564456',
      pointsEarned: 40
    }, {orderId, email});
  },

  getNavigationTree: function () {
    let navigationAndCountries = require('./json/main-navigation.json');
    return editJsonPopup('getNavigationTree', navigationAndCountries.navigation.menusList);
  },

  getCountriesList: function () {
    return editJsonPopup('getCountriesList', {
      'countriesMap': [
        {
          'id': 'US',
          'displayName': 'United States',
          'siteId': 'us',
          'currencyId': 'USD',
          'disallowOtherCurrencies': true
        },
        {
          'id': 'CA',
          'displayName': 'CANADA',
          'siteId': 'ca',
          'currencyId': 'CAD',
          'disallowOtherCurrencies': true
        }
      ],
      'currenciesMap': [
        {
          'id': 'USD',
          'displayName': 'Dollars',
          'exchangevalue': '1.0',
          'merchantMargin': '1.0',
          'quoteId': '34610620',
          'exchangeRoundMethod': '-2'
        }, {
          'id': 'CAD',
          'displayName': 'Canada Dollar',
          'exchangevalue': '1.0',
          'merchantMargin': '1.0',
          'quoteId': '35410620',
          'exchangeRoundMethod': '2'
        }, {
          'id': 'eur',
          'displayName': 'Euros',
          'exchangevalue': '84.9241000000',
          'merchantMargin': '1.0000000000',
          'quoteId': '34612620',
          'exchangeRoundMethod': '1'
        }, {
          'id': 'ars',
          'displayName': 'Argentina Peso',
          'exchangevalue': '84.9241000000',
          'merchantMargin': '1.0000000000',
          'quoteId': '54610620',
          'exchangeRoundMethod': '-1'
        }, {
          'id': 'cop',
          'displayName': 'Colombia Peso',
          'exchangevalue': '84.9241000000',
          'merchantMargin': '1.0000000000',
          'quoteId': '34610440',
          'exchangeRoundMethod': '3'
        }
      ]
    });
  },

/**
 * @function getFooterLinks
 * @summary This will return a static json, this does not make an API call to get footer links, beacuse there is not any.
 * @return {Object[]} See below for the structure
 */
  getFooterLinks: function (isGuest, isRemembered, country) {
    let nameSufix = ((isGuest && !isRemembered && 'G' + 'uest') || (isRemembered && 'Rem' + 'embered') || ('Reg' + 'istered')) + (country || 'US');
    // let nameSufix = (isGuest ? 'Guest' : 'Registered') + country || 'US';
    let footerNavigation = require('./../resources/footerNavigation/footerNavigation' + nameSufix + '.json');
  // let footerNavigation = require('./../resources/footerNavigation.json'); // nodejs mode
    return editJsonPopup('getFooterLinks', footerNavigation, {isGuest, country});
  },

  submitAutoSuggestionForm: function (term) {
    return editJsonPopup('submitAutoSuggestionForm', '', {term});
  }
};
