/**
 * @module CreditCardItem
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {PaymentCardTitleDisplay} from './PaymentCardTitleDisplay.jsx';
import {CheckBalanceFormContainer} from './CheckBalanceFormContainer.js';

const GIFT_CARD_ENTRY_PROPTYPE = PropTypes.shape({
  onFileCardId: PropTypes.string.isRequired,
  cardType: PropTypes.oneOf(['GIFT CARD', 'STORE CREDIT']).isRequired,
  imgPath: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired
});

class GiftCardItem extends React.Component {
  static propTypes = {
    giftCardEntry: GIFT_CARD_ENTRY_PROPTYPE.isRequired,

    /**
     * callback to handle request to delete a card item. It should accept a
     * single parameter that is the gift card entry
     */
    onDeleteItem: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  handleDeleteItem () {
    return this.props.onDeleteItem(this.props.giftCardEntry);
  }

  render () {
    let {giftCardEntry} = this.props;
    return (
      <li className="gift-card-item-container">
        <PaymentCardTitleDisplay title={giftCardEntry.cardType === 'GIFT CARD' ? 'Gift Card' : 'Merchandise Credit'} />
        <button className="button-close" onClick={this.handleDeleteItem}></button>

        <p className="card-info">
          <img src={giftCardEntry.imgPath} alt="Card icon" />
          <strong className="ending-numbers">ending in {giftCardEntry.cardEndingNumbers}</strong>
        </p>

        {giftCardEntry.balance !== null
          ? <p className="balance">
            <strong className="remaining-balance-title">Remaining balance</strong>
            <span className="total-balance">${giftCardEntry.balance}</span>
          </p>
          : <CheckBalanceFormContainer giftCardEntry={giftCardEntry} />
        }
      </li>
    );
  }
}

export {GiftCardItem, GIFT_CARD_ENTRY_PROPTYPE};
