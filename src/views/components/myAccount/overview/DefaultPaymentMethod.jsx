/**
* @module DefaultPaymentMethod
* @summary Module to show used payment method (cc or paypal) and button update in My Account
*
* @author Florencia Acosta <facosta@minutentag.com>
* @author Miguel <malvarez@minutentag.com>
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {ACCEPTED_CREDIT_CARDS_COPY} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards.js';

class DefaultPaymentMethod extends React.Component {
  static propTypes = {
    card: PropTypes.shape({
      onFileCardId: PropTypes.string.isRequired,
      cardType: PropTypes.string.isRequired,
      cardNumber: PropTypes.string.isRequired
    })
  }

  render () {
    let {card} = this.props;

    return (
      <section className="default-payment-method-container">
        <strong className="default-payment-method-title">Default Payment Method</strong>
        {
          card ? (
            <div>
              <p className="card-info">
                <span className="type-card-name">{ACCEPTED_CREDIT_CARDS_COPY[card.cardType]}</span>
                ending in {card.cardNumber && (card.cardNumber.substr(card.cardNumber.length - 4))}
              </p>

              <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.editCreditCard} className="button-primary button-update"
                pathSuffix={card.onFileCardId} aria-label="Update payment method">Update</HyperLink>
            </div>
          ) : (
            <div>
              <span className="empty-payment-method-title">Save Your Payment Method</span>
              <p className="empty-payment-method-message">Securely store your credit card info so you can check out even faster&#33;</p>
              <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.addCreditCard} className="button-primary button-add-payment-method"
                aria-label="Add a payment method">Add a Payment Method</HyperLink>
            </div>
          )
        }
      </section>
    );
  }
}

export {DefaultPaymentMethod};
