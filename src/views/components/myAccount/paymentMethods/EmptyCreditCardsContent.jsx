/** @module EmptyCreditCardsContent
 * @summary
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Agu
 */

import React from 'react';
import {PaymentMethodsTitleDisplay} from 'views/components/myAccount/paymentMethods/PaymentMethodsTitleDisplay.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

class EmptyCreditCardsContent extends React.Component {
  render () {
    return (
      <section className="cards-empty-container">
        <PaymentMethodsTitleDisplay title="Credit & Debit Cards" />

        <div className="empty-content-and-button">
          <div className="cards-empty-content">
            <h4 className="cards-empty-title">
              <img className="card-figure" src="/wcsstore/static/images/place-card-small.png" />
              Add a credit card to check out faster!
            </h4>

            <p className="cards-empty-message">Securely save your credit card, debit card and/or My Place Rewards Credit Card information so you can check out even faster.</p>
          </div>

          <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.addCreditCard}
            className="button-new-method button-secondary">Add a credit card</HyperLink>
        </div>
      </section>
    );
  }
}

export {EmptyCreditCardsContent};
