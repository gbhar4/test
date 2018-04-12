/**
 * @module Payments
 * Shows the different views for the user to manage payment cards and gift cards in My Account.
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';

import cssClassName from 'util/viewUtil/cssClassName';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

import {AddOrEditCreditCardFormContainer} from 'views/components/myAccount/paymentMethods/AddOrEditCreditCardFormContainer.js';
import {AddGiftCardFormContainer} from 'views/components/myAccount/paymentMethods/AddGiftCardFormContainer.js';
import {PaymentsListContainer} from 'views/components/myAccount/paymentMethods/PaymentsListContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('views/components/myAccount/paymentMethods/_d.payment-and-giftcard-section.scss');
} else {
  require('views/components/myAccount/paymentMethods/_m.payment-and-giftcard-section.scss');
}

class Payments extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  render () {
    let {className} = this.props;
    let paymentAndGiftcardContainerClass = cssClassName('payment-and-giftcard-section ', className);
    let paymentAndGiftCardsRoute = MY_ACCOUNT_SECTIONS.paymentAndGiftCards;

    return (
      <div className={paymentAndGiftcardContainerClass}>
        <Switch>
          <Route path={paymentAndGiftCardsRoute.subSections.addCreditCard.pathPattern}
            component={AddOrEditCreditCardFormContainer}
            componentProps={{isHavePhoneField: true, isShowSetAsDefault: true, submitButtonText: 'Add'}} />

          <Route path={paymentAndGiftCardsRoute.subSections.editCreditCard.pathPattern}
            component={AddOrEditCreditCardFormContainer}
            componentProps={{isHavePhoneField: true, isShowSetAsDefault: true, submitButtonText: 'Update'}} />

          <Route path={paymentAndGiftCardsRoute.subSections.addGiftCard.pathPattern}
            component={AddGiftCardFormContainer} />

          <Route path={paymentAndGiftCardsRoute.pathPattern} component={PaymentsListContainer} />
        </Switch>
      </div>
    );
  }
}

export {Payments};
