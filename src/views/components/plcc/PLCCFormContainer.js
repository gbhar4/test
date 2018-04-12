/**
 * @module Plcc App Form Container
 * @summary This Container exports 2 components that wrap the same form. 1 component is for checkout pre-screen and the other is for the general credit card application.
 * @author Agu
 * @author Michael Citro
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PLCCForm} from './PLCCForm.jsx';
import {getVendorFormOperator} from 'reduxStore/storeOperators/formOperators/vendorFormOperator.js';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {PAGES} from 'routing/routes/pages.js';
// import {PLCC_SECTIONS} from 'routing/routes/plccRoutes.js';

function mapStateToProps (state, ownProps, storeOperators) {
  if (!generalStoreView.getIsWicFormEnabled(state) && ownProps.isInstantCredit) {
    storeOperators.routingOperator.gotoPage(PAGES.webInstantCredit);
  }

  if (userStoreView.getUserIsPlcc(state) && ownProps.isInstantCredit) {
    // storeOperators.routingOperator.replaceLocation(PLCC_SECTIONS.existingAccount);
    storeOperators.routingOperator.gotoPage(PAGES.webInstantCredit);
  }

  // getRegisteredUserAPI returns a possible default address
  let defaultPlccAddress = addressesStoreView.getDefaultPlccAddress(state);

  // if on checkout get checkout form values else get default address returned from service if we have one
  let plccAddress = !ownProps.isInstantCredit ? checkoutStoreView.getShippingFormValues(state) : defaultPlccAddress;

  if (!plccAddress || Object.getOwnPropertyNames(plccAddress).length === 0) {
    plccAddress = defaultPlccAddress || {};
  } else if (!plccAddress.emailAddress) {
    // Registered users do not need to enter email address into the form that getShippingFormValues returns, so we extract from redux view
    plccAddress = Object.assign({}, plccAddress, {emailAddress: userStoreView.getUserEmail(state)});
  }

  let birthDateOptionMap = plccStoreView.getBirthDateOptionMap(state);

  // FIXME: handling all the WIC/PLCC modals scenarios on the same component
  // is getting convoluted / difficult to maintain. Neet to clean it up.
  // This is also probably not the best way of doing this, triggering a store listener on a container?
  /* (FIXME: UPDATE! Lets Please Create a seperate Conatiner for Checkout and PLCC Page) */
  if (!ownProps.isModal && ownProps.isInstantCredit && plccStoreView.isApplicationApproved(state)) {
    storeOperators.globalSignalsOperator.observeLogin(() => storeOperators.routingOperator.gotoPage(PAGES.homePage));
  }

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    onSubmit: ownProps.isModal ? storeOperators.vendorFormOperator.submitPrescreenApplicationForm : storeOperators.vendorFormOperator.submitPLCCApplicationForm,
    // FIXME: all this logic in here. might be cleaner just to define different containers for each form (WIC form, PLCC form [checkout], WIC modal form)
    onDeclineClick: ownProps.isModal
      ? (ownProps.isInstantCredit
        ? storeOperators.plccOperator.dismissWicModal
        : storeOperators.plccOperator.submitDeclinePlccOffer)
      : storeOperators.plccOperator.declinePlccOffer,
    onDismissModal: ownProps.isModal
      ? (ownProps.isInstantCredit
        ? storeOperators.plccOperator.dismissWicModal
        : storeOperators.plccOperator.dismissPlccModal)
      : null,
    onRestartPlccApplication: storeOperators.plccOperator.restartPlccApplication,
    application: plccStoreView.getApplication(state),
    isApplicationApproved: plccStoreView.isApplicationApproved(state),
    isApplicationPending: plccStoreView.isApplicationPending(state),
    isApplicationExisting: plccStoreView.isApplicationExisting(state),
    // isApplicationError: plccStoreView.isApplicationError(state),
    isApplicationTimeout: plccStoreView.isApplicationTimeout(state),
    isAddressVerifyModalOpen: addressesStoreView.isVerifyAddressModalOpen(state),

    countriesOptionsMap: addressesStoreView.getCountriesOptionsMap(state),
    countriesStatesTable: addressesStoreView.getCountriesStatesTable(state),
    dayOptionsMap: birthDateOptionMap.daysMap,
    monthOptionsMap: birthDateOptionMap.monthsMap,
    yearOptionsMap: birthDateOptionMap.yearsMap,
    allowAccessFromCurrentCountry: plccStoreView.getCurrentCountry(state) === 'US' && true,

    isShowApplyButton: generalStoreView.getIsWicFormEnabled(state),

    initialValues: {
      address: {
        ...plccAddress.address,
        country: 'US' // PLCC only applicable to 'US' // NOTE: move somewhere else?
      },
      phoneNumber: plccAddress.phoneNumber,
      emailAddress: plccAddress.emailAddress
    },

    snareApiUrl: routingInfoStoreView.getApiHelper(state).configOptions.apiKeys.SNARE
  };
}

// This is ONLY for the check PLCC form, either on shipping or express checkout page.
function mapStateToPropsCheckoutForm (state, ownProps, storeOperators) {
  // if toggled due to express checkout get billing address, else get shipping address
  let plccAddress = checkoutStoreView.getIsReviewStage(state) ? checkoutStoreView.getBillingValues(state) : checkoutStoreView.getShippingFormValues(state);

  // Registered users do not need to enter email address into the form that getShippingFormValues returns, so we extract from redux view
  if (!plccAddress.emailAddress) {
    plccAddress = Object.assign({}, plccAddress, {emailAddress: userStoreView.getUserEmail(state)});
  }

  let birthDateOptionMap = plccStoreView.getBirthDateOptionMap(state);

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    onSubmit: storeOperators.vendorFormOperator.submitPrescreenApplicationForm,
    onDeclineClick: storeOperators.plccOperator.submitDeclinePlccOffer,
    onDismissModal: storeOperators.plccOperator.dismissPlccModal,
    onRestartPlccApplication: storeOperators.plccOperator.restartPlccApplication,
    application: plccStoreView.getApplication(state),
    isApplicationApproved: plccStoreView.isApplicationApproved(state),
    isApplicationPending: plccStoreView.isApplicationPending(state),
    isApplicationExisting: plccStoreView.isApplicationExisting(state),
    isApplicationTimeout: plccStoreView.isApplicationTimeout(state),
    isAddressVerifyModalOpen: addressesStoreView.isVerifyAddressModalOpen(state),

    countriesOptionsMap: addressesStoreView.getCountriesOptionsMap(state),
    countriesStatesTable: addressesStoreView.getCountriesStatesTable(state),
    dayOptionsMap: birthDateOptionMap.daysMap,
    monthOptionsMap: birthDateOptionMap.monthsMap,
    yearOptionsMap: birthDateOptionMap.yearsMap,
    allowAccessFromCurrentCountry: plccStoreView.getCurrentCountry(state) === 'US' && true,

    isShowApplyButton: generalStoreView.getIsWicFormEnabled(state),

    initialValues: {
      address: {
        ...plccAddress.address,
        country: 'US' // PLCC only applicable to 'US' // NOTE: move somewhere else?
      },
      phoneNumber: plccAddress.phoneNumber,
      emailAddress: plccAddress.emailAddress
    },

    snareApiUrl: routingInfoStoreView.getApiHelper(state).configOptions.apiKeys.SNARE
  };
}

let PLCCFormContainer = connectPlusStoreOperators({
  plccOperator: getPlccOperator,
  vendorFormOperator: getVendorFormOperator,
  routingOperator: getRoutingOperator,
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps)(PLCCForm);

let CheckoutPLCCFormContainer = connectPlusStoreOperators({
  plccOperator: getPlccOperator,
  vendorFormOperator: getVendorFormOperator,
  routingOperator: getRoutingOperator,
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToPropsCheckoutForm)(PLCCForm);

export {PLCCFormContainer, CheckoutPLCCFormContainer};
