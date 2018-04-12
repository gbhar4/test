/**
* @module CreditCardFormPartContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/
import {formValueSelector} from 'redux-form';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CreditCardFormPart} from 'views/components/billing/CreditCardFormPart.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';

const mapStateToProps = function (state, ownProps) {
  let editingCardType = ownProps.cardType || null;
  let selector = formValueSelector(ownProps.formName);
  let cardNumber = selector(state, 'cardNumber');
  let card = { cardNumber: cardNumber, cardType: editingCardType };
  let cardType = paymentCardsStoreView.getCreditCardType(card);
  let cardTypeImgUrl = paymentCardsStoreView.getCreditCardIcon(card);
  let isExpirationRequired = !cardNumber || !cardType || paymentCardsStoreView.getIsEditingCardExpirationRequired(state, cardType);

  return {
    // FIXME review this whole cardType isssue
    isMobile: routingInfoStoreView.getIsMobile(state),
    isGuest: userStoreView.isGuest(state),
    isCVVRequired: false,
    isExpirationRequired: isExpirationRequired,
    expMonthOptionsMap: checkoutStoreView.getCreditCardExpirationOptionMap(state).monthsMap,
    expYearOptionsMap: checkoutStoreView.getCreditCardExpirationOptionMap(state).yearsMap,
    cardType: cardType,
    cardTypeImgUrl: cardTypeImgUrl
  };
};

let CreditCardFormPartContainer = connectPlusStoreOperators(mapStateToProps)(CreditCardFormPart);

export {CreditCardFormPartContainer};
