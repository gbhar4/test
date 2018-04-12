import {logError, logErrorAndServerThrow} from './operatorHelper';
import {setContactInfo, setIsGuest, setUserId, setIsPlcc, /* getSetPlccCardIdActn, getSetPlccCardNumberActn, */
  setIsRemembered, setRewardPoints, setRewardDollars,
  setRewardDollarsNextMonth, setRewardPointsToNextReward,
  getSetDefaultWishlistIdActn,
  setIsExpressEligible, getSetChildrenActn, getSetPointsHistoryTotalPagesActn,
  getSetPointsHistoryPageActn, getSetRewardAccountNumber, getSetAssociateIdActn,
  getSetAirmilesAccountActn
} from 'reduxStore/storeReducersAndActions/user/user';
import {getUserAbstractor} from 'service/userServiceAbstractor';
import {getSetIsRopisEnabledActn,
  getSetCurrentCountryActn,
  getSetCurrentCurrencyActn,
  getSetCurrentLanguageActn,
  getSetIsBopisEnabledActn} from 'reduxStore/storeReducersAndActions/session/session';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getLoadSitePromoAction, getSetIsLoadedActn} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getR3Abstractor} from 'service/R3ServiceAbstractor';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {vendorRoutingStoreView} from 'reduxStore/storeViews/routing/vendorRoutingStoreView.js';
import {getSetAddressBookActn, getSetPlccDefaultAddressActn} from 'reduxStore/storeReducersAndActions/addresses/addresses';
// import {getSetIsRopisEnabledActn} from 'reduxStore/storeReducersAndActions/session/session';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';
import {getLanguageFromDomain} from 'routing/routingHelper.js';

let previous = null;
export function getUserOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new UserOperator(store);
  }
  return previous;
}

class UserOperator {
  constructor (store) {
    this.store = store;

    bindAllClassMethodsToThis(this);
  }

  get userServiceAbstractor () {
    return getUserAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get r3ServiceAbstractor () {
    return getR3Abstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  setRewardPointsData () {
    // backend cannot handle points on guest users,
    // so making it only on registered / rememebered users
    let storeState = this.store.getState();
    if (userStoreView.isGuest(storeState) && !userStoreView.isRemembered(storeState)) {
      return Promise.resolve();
    }

    return this.userServiceAbstractor.getCurrentRewardPoints().then((res) => {
      this.store.dispatch([
        setRewardPoints(res.currentPoints),
        setRewardDollars(res.currentMonthsRewards),
        setRewardDollarsNextMonth(res.nextMonthRewards),
        setRewardPointsToNextReward(res.pointsToNextReward)
        // TODO: add language and country
      ]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'setRewardPointsData', err);
    });
  }

  setUserBasicInfo () {
    return this.userServiceAbstractor.getProfile().then((res) => {
      let state = this.store.getState();
      let newSiteId = sitesAndCountriesStoreView.getSiteIdForCountry(state, res.country);
      // when the language or siteId change redirect the user to the homepage of the corresponding site.
      if ((res.language && res.language !== sitesAndCountriesStoreView.getCurrentLanguage(state) && getLanguageFromDomain(document.location.host) !== res.language) || newSiteId !== sitesAndCountriesStoreView.getCurrentSiteId(state)) {
        document.location = vendorRoutingStoreView.getHomepageURL(state, newSiteId, res.language);
        return Promise.resolve();
      } else {
        this.store.dispatch([
          setContactInfo({
            firstName: res.firstName,
            lastName: res.lastName,
            emailAddress: res.email,
            phoneNumber: res.phone
          }),
          setUserId(res.userId),
          setIsGuest(!res.isLoggedin),
          setIsRemembered(res.isRemembered),
          getSetDefaultWishlistIdActn(res.defaultWishlistId),
          getSetPlccDefaultAddressActn(res.defaultPlccAddress),
          setIsPlcc(res.isPlcc),
          // getSetPlccCardIdActn(res.plccCardId), // not needed on every page, as per DT-21960
          // getSetPlccCardNumberActn(res.plccCardNumber), // not needed on every page, as per DT-21960
          res.country && getSetCurrentCountryActn(res.country),
          res.currency && getSetCurrentCurrencyActn(res.currency),
          res.language && getSetCurrentLanguageActn(res.language),

          getSetIsBopisEnabledActn(res.isBopisEnabled),
          getSetIsRopisEnabledActn(res.isRopisEnabled),

          setIsExpressEligible(res.isExpressEligible),
          getSetAirmilesAccountActn(res.airmilesAccountNumber),
          getSetRewardAccountNumber(res.myPlaceNumber),
          getSetAssociateIdActn(res.associateId),
          res.addressBook && getSetAddressBookActn(res.addressBook),

          res.userPoints && setRewardPoints(res.userPoints.currentPoints),
          res.userPoints && setRewardDollars(res.userPoints.currentMonthsRewards),
          res.userPoints && setRewardDollarsNextMonth(res.userPoints.nextMonthRewards),
          res.userPoints && setRewardPointsToNextReward(res.userPoints.pointsToNextReward)
        ]);

        if (!sitesAndCountriesStoreView.getIsCanada(this.store.getState())) {
          // non-blocking, if it doesn't load, I don't care
          getStoresOperator(this.store).loadDefaultStore().catch((err) => { logError(this.store, 'loadDefaultStore', err); });
        }

        // in case backend service is not ready or fails
        if (!res.userPoints) {
          return this.setRewardPointsData();
        }
      }
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'setUserBasicInfo', err);
      // FIXME: Patch for R3. On login setIsGuest(!res.isLoggedin) causes error not setting the correct points
      return this.setRewardPointsData();
    });
  }

  getAllAvailableCouponsAndPromos () {
    return this.userServiceAbstractor.getAllAvailableCouponsAndPromos().then((res) => {
      return this.store.dispatch([getLoadSitePromoAction(res), getSetIsLoadedActn(true)]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getAllAvailableCouponsAndPromos', err);
    });
  }

  getChildren () {
    return this.r3ServiceAbstractor.getChildren().then((res) => {
      return this.store.dispatch(getSetChildrenActn(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getChildren', err);
    });
  }

  getPointsHistoryPage (pageNumber, useCache = true) {
    if (useCache) {
      let cachedPointsPages = userStoreView.getPointsHistoryPages(this.store.getState());
      if (cachedPointsPages[pageNumber - 1]) {
        return new Promise((resolve) => resolve());
      }
    }
    return this.r3ServiceAbstractor.getPointsHistory(pageNumber).then((res) => {
      return this.store.dispatch([
        getSetPointsHistoryTotalPagesActn(res.totalPages),
        getSetPointsHistoryPageActn(pageNumber, res.pointsTransactions)
      ]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getPointsHistoryPage', err);
    });
  }
}
