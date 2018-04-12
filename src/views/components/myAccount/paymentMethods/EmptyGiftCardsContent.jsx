/** @module EmptyGiftCardsContent
 * @summary
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Agu
 */

import React from 'react';
import {PaymentMethodsTitleDisplay} from 'views/components/myAccount/paymentMethods/PaymentMethodsTitleDisplay.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

class EmptyGiftCardsContent extends React.Component {
  render () {
    return (
      <section className="giftcard-empty-container">
        <PaymentMethodsTitleDisplay title="Gift Cards & Merchandise Credits" />

        <div className="empty-content-and-button">
          <div className="giftcard-empty-content">
            <h4 className="giftcard-empty-title">
              <img className="giftcard-figure" src="/wcsstore/static/images/gift-card-small.png" />
              Add gift cards and/or merchandise credits.
            </h4>
            <p className="giftcard-empty-message">Save up to 5 gift cards and/or merchandise credits to use the next time you shop.</p>
          </div>

          <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.addGiftCard}
            className="button-add-new-giftcard button-secondary">Add a gift card</HyperLink>
        </div>
      </section>
    );
  }
}

export {EmptyGiftCardsContent};
