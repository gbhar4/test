/**
 * @module CreditCardItem
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {PaymentCardTitleDisplay} from './PaymentCardTitleDisplay.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {ACCEPTED_CREDIT_CARDS} from 'reduxStore/storeViews/checkoutStoreView.js';

const CREDIT_CARD_ENTRY_PROPTYPE = PropTypes.shape({
  onFileCardId: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  imgPath: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
  expYear: PropTypes.number.isRequired,
  expMonth: PropTypes.number.isRequired,
  address: ContactInfoDisplay.propTypes.address.isRequired
});

class CreditCardItem extends React.Component {
  static propTypes = {
    creditCardEntry: CREDIT_CARD_ENTRY_PROPTYPE.isRequired,

    /**
     * callback to handle request to delete a card item. It should accept a
     * single parameter that is the credit card entry
     */
    onDeleteItem: PropTypes.func.isRequired,

    /**
    * callback to handle request to mark a card as default. It should accept
    * a single parameter that is the credit card entry
    */
    onSetAsDefault: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleSetAsDefault = this.handleSetAsDefault.bind(this);
  }

  handleDeleteItem () {
    return this.props.onDeleteItem(this.props.creditCardEntry);
  }

  handleSetAsDefault () {
    return this.props.onSetAsDefault(this.props.creditCardEntry);
  }

  render () {
    let {creditCardEntry} = this.props;

    return (
      <li className="credit-card-item-container">
        <PaymentCardTitleDisplay title={creditCardEntry.cardType === ACCEPTED_CREDIT_CARDS['PLACE CARD'] ? 'My Place Rewards Credit Card' : 'Credit Card'} />
        <button className="button-close" onClick={this.handleDeleteItem}></button>

        <p className="card-info">
          <img src={creditCardEntry.imgPath} alt={creditCardEntry.cardType} />
          <strong className="ending-numbers">ending in {creditCardEntry.cardEndingNumbers}</strong>
          {creditCardEntry.cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD'] && <strong className="expires-message">Expires on {creditCardEntry.expMonth}/{creditCardEntry.expYear}</strong>}
        </p>

        {creditCardEntry.address.firstName && <ContactInfoDisplay address={creditCardEntry.address} isShowAddress />}

        {creditCardEntry.isDefault
          ? <span className="default-payment-method">Default Payment Method</span>
          : <button className="button-default-payment-method" onClick={this.handleSetAsDefault}>Make Default</button>
        }

        <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.editCreditCard}
          pathSuffix={creditCardEntry.onFileCardId} className="button-edit">Edit</HyperLink>
      </li>
    );
  }
}

export {CreditCardItem, CREDIT_CARD_ENTRY_PROPTYPE};
