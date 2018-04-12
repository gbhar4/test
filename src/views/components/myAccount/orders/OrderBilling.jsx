/**
 * @module OrderBilling
 * Shows purchase order billing information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

class OrderBilling extends React.Component {
  static propTypes = {
    billing: PropTypes.shape({
      /** Flags if the billing address is the same as the shipping address */
      sameAsShipping: PropTypes.bool.isRequired,
      /** Payment card type and number */
      card: PropTypes.shape({
        cardType: PropTypes.string.isRequired,
        imgPath: PropTypes.string.isRequired,
        endingNumbers: PropTypes.string.isRequired
      }),
      /** DT-31151 - Display billing name and address */
      billingAddress: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        addressLine1: PropTypes.string.isRequired,
        addressLine2: PropTypes.string,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        zipCode: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
      })
    }),
    /** gift cards applied to the cart */
    appliedGiftCards: PropTypes.arrayOf(PropTypes.shape({
      /** last 4 numbers of the gift card */
      endingNumbers: PropTypes.string.isRequired
    }))
  }

  render () {
    let {
      billing: {
        sameAsShipping,
        card,
        billingAddress
      },
      appliedGiftCards
    } = this.props;

    let cardEndingNumbers = card && card.endingNumbers.substr(-4);

    return (
      <div className="billing-section">
        <p className="title-description">Billing</p>
        {/* TODO: style same as shipping */}
        {sameAsShipping && <p className="message-same-as-shipping">Same as shipping</p>}

        {cardEndingNumbers && <p className="card-info">
          <img src={card.imgPath} alt={card.cardType} />
          <strong className="card-type">{card.cardType}</strong>
          <span className="card-suffix">Ending in {cardEndingNumbers}</span>
        </p>}

        {billingAddress && <ContactInfoDisplay address={billingAddress} isShowAddress
          isShowCountry={false} isShowPhone={false} isShowEmail={false} />}

        {appliedGiftCards && appliedGiftCards.length > 0 &&
          <section className="gift-cards-container">
            <strong className="title-gift-card-applied">Gift Cards</strong>
            <ul className="giftcard-list-display">
              {appliedGiftCards.map((giftCard, index) => {
                let giftCardEndeningNumbers = giftCard.endingNumbers.substr(-4);
                return (
                  <li key={index} className="giftcard">
                    <p className="balance">Ending in {giftCardEndeningNumbers}</p>
                  </li>
                );
              })}
            </ul>
          </section>}
      </div>
    );
  }
}

export {OrderBilling};
