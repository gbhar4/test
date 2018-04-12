/** @module PaymentsList
 * @summary
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {CreditCardsList} from './CreditCardsList.jsx';
import {GiftCardsList} from './GiftCardsList.jsx';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.payment-and-giftcard-section.scss');
} else {
  require('./_m.payment-and-giftcard-section.scss');
}

class PaymentsList extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    className: PropTypes.string,
    paymentCardsEntries: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    giftCardsEntries: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onDeleteCreditCard: PropTypes.func.isRequired,
    onSetAsDefaultCreditCard: PropTypes.func.isRequired,
    onDeleteGiftCard: PropTypes.func.isRequired,

    /** message to show because of successfull operations */
    successMessage: PropTypes.string,

    /** callback to clear the success message */
    onClearSuccessMessage: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.handleDeleteCreditCard = this.handleDeleteCreditCard.bind(this);
    this.handleSetAsDefaultCreditCard = this.handleSetAsDefaultCreditCard.bind(this);
    this.handleDeleteGiftCard = this.handleDeleteGiftCard.bind(this);
    this.clearSuccessMessage = this.clearSuccessMessage.bind(this);
  }

  clearSuccessMessage () {
    this.props.onClearSuccessMessage();
  }

  handleDeleteCreditCard (card) {
    this.clearSuccessMessage();
    return this.props.onDeleteCreditCard(card);
  }

  handleSetAsDefaultCreditCard (card) {
    this.clearSuccessMessage();
    return this.props.onSetAsDefaultCreditCard(card);
  }

  handleDeleteGiftCard (card) {
    this.clearSuccessMessage();
    return this.props.onDeleteGiftCard(card);
  }

  render () {
    let {className, isMobile, paymentCardsEntries, giftCardsEntries, successMessage} = this.props;
    let paymentAndGiftcardContainerClass = cssClassName('payment-and-giftcard-section ', className);

    return (<div className={paymentAndGiftcardContainerClass}>
      <ContentSlot contentSlotName="account_payment_top_banner" className="my-place-rewards-banner" />
      {successMessage && <SuccessMessage message={successMessage} />}
      <CreditCardsList isMobile={isMobile} items={paymentCardsEntries} onDeleteItem={this.handleDeleteCreditCard} onSetAsDefault={this.handleSetAsDefaultCreditCard} />
      <GiftCardsList isMobile={isMobile} items={giftCardsEntries} onDeleteItem={this.handleDeleteGiftCard} />
    </div>);
  }
}

export {PaymentsList};
