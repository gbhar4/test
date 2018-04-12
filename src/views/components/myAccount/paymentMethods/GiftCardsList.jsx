/** @module CreditCardsList
 * @summary a presentational component for rendering the list of credit cards in
 * the user wallet
 *
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {GiftCardItem, GIFT_CARD_ENTRY_PROPTYPE} from './GiftCardItem.jsx';
import {ConfirmDeleteGiftCardModal} from './ConfirmDeleteGiftCardModal.jsx';
import {EmptyGiftCardsContent} from './EmptyGiftCardsContent.jsx';

import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';

class GiftCardsList extends React.Component {

  static propTypes = {
    /** address to include in the list */
    items: PropTypes.arrayOf(GIFT_CARD_ENTRY_PROPTYPE).isRequired,

    /**
     * callback to handle request to delete an address item. It should accept a
     * single parameter that is the addressBookEntry id.
     */
    onDeleteItem: PropTypes.func.isRequired
  }

  state = {
    error: null
  }

  constructor (props) {
    super(props);
    this.state = {deletingItem: null};
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.setError = getSetErrorInStateMethod(this);
  }

  handleDeleteItem (address) {
    this.setState({deletingItem: address});
    this.props.onDeleteItem(address)
      .then(() => this.setError()).catch((err) => this.setError(err));
  }

  render () {
    let {isMobile, items} = this.props;
    let {deletingItem} = this.state;

    if (items.length === 0) {
      return <EmptyGiftCardsContent />;
    }
    return (
      <div className="credit-cards-container">
        {this.state.error && <ErrorMessage error={this.state.error} />}

        <div className="payment-section-title-container">
          <h2 className="payment-section-title">Gift Cards & Credit</h2>
          <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.addGiftCard}
            className="payment-add-new-button">Add New</HyperLink>
        </div>

        <ul className="credit-card-items">
          {items.map((item) => { // render each address item
            return (<GiftCardItem key={item.onFileCardId} giftCardEntry={item}
              onDeleteItem={this.handleDeleteItem} />
            );
          })}
        </ul>

        <ConfirmDeleteGiftCardModal isMobile={isMobile} deletingItem={deletingItem} />
      </div>
    );
  }

}

export {GiftCardsList};
