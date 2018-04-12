/**
* @module CreditCardFormPartContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/
import {PropTypes} from 'prop-types';
import {formValueSelector} from 'redux-form';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CreditCardFormPart} from './CreditCardFormPart.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';

const PROP_TYPES = {
  /** type of the card that is being edited */
  cardType: PropTypes.string
};

// FIXME: there should be a different container for edit "edit" form from checkout,
// we're using formName to differentiate the 2 scenarios (checkout vs checkout edit) but it's not a nice way of doing it
const mapStateToProps = function (state, ownProps) {
  // if user is editing, we need to get the type from memory, not from the cardNumber
  let checkoutDetails = !ownProps.formName && checkoutStoreView.getBillingValues(state);
  let editingCardType = !ownProps.formName ? paymentCardsStoreView.getCreditCardType(checkoutDetails.billing) : ownProps.cardType;

  // REVIEW: -- we're reusing the container on add new card mobile and checkout add new card
  // which do not use the same form name. Options:
  // (A) define a new container for each one?
  // (B) pass the formName as prop? (current)
  // (C) do the card type calculation with adaptiveFields or adaptiveFormPart instead of doing it in the container
  // (D) I guess (c) would be the correct way but I'm open to suggestions
  let selector = formValueSelector(ownProps.formName || 'checkoutBilling');
  let cardNumber = selector(state, 'cardNumber');
  let card = { cardNumber: cardNumber, cardType: editingCardType };
  let cardType = paymentCardsStoreView.getCreditCardType(card);
  let cardTypeImgUrl = paymentCardsStoreView.getCreditCardIcon(card);
  let isExpirationRequired = !cardNumber || !cardType || paymentCardsStoreView.getIsEditingCardExpirationRequired(state, cardType);
  let isCVVRequired = !cardNumber || !cardType || paymentCardsStoreView.getIsEditingCardCVVRequired(state, cardType);

  return {
    // FIXME review this whole cardType isssue
    isMobile: routingInfoStoreView.getIsMobile(state),
    isGuest: userStoreView.isGuest(state),
    isExpirationRequired: isExpirationRequired,
    isCVVRequired: !ownProps.formName && isCVVRequired,
    expMonthOptionsMap: checkoutStoreView.getCreditCardExpirationOptionMap(state).monthsMap,
    expYearOptionsMap: checkoutStoreView.getCreditCardExpirationOptionMap(state).yearsMap,
    cardType: cardType,
    cardTypeImgUrl: cardTypeImgUrl
  };
};

let CreditCardFormPartContainer = connectPlusStoreOperators(mapStateToProps)(CreditCardFormPart);
CreditCardFormPartContainer.propTypes = {...CreditCardFormPartContainer.propTypes, ...PROP_TYPES};

export {CreditCardFormPartContainer};
