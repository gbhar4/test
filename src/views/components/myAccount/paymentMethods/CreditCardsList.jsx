/** @module CreditCardsList
 * @summary a presentational component for rendering the list of credit cards in
 * the user wallet
 *
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CreditCardItem, CREDIT_CARD_ENTRY_PROPTYPE} from './CreditCardItem.jsx';
import {ConfirmDeleteCreditCardModal} from './ConfirmDeleteCreditCardModal.jsx';
import {EmptyCreditCardsContent} from './EmptyCreditCardsContent.jsx';

import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';

class CreditCardsList extends React.Component {

  static propTypes = {
    /** address to include in the list */
    items: PropTypes.arrayOf(CREDIT_CARD_ENTRY_PROPTYPE).isRequired,

    /**
     * callback to handle request to delete an address item. It should accept a
     * single parameter that is the addressBookEntry id.
     */
    onDeleteItem: PropTypes.func.isRequired,

    /**
    * callback to handle request to mark an address as default. It should accept
    * a single parameter that is the addressBookEntry id.
    */
    onSetAsDefault: PropTypes.func.isRequired
  }

  state = {
    error: null
  }

  constructor (props) {
    super(props);
    this.state = {deletingItem: null};
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleSetAsDefault = this.handleSetAsDefault.bind(this);
    this.setError = getSetErrorInStateMethod(this);
  }

  handleDeleteItem (address) {
    this.setState({deletingItem: address});
    return this.props.onDeleteItem(address)
      .then(() => this.setError()).catch((err) => this.setError(err));
  }

  handleSetAsDefault (address) {
    return this.props.onSetAsDefault(address)
      .then(() => this.setError()).catch((err) => this.setError(err));
  }

  render () {
    let {isMobile, items} = this.props;
    let {deletingItem} = this.state;

    if (items.length === 0) {
      return <EmptyCreditCardsContent />;
    }

    return (
      <div className="credit-cards-container">
        {this.state.error && <ErrorMessage error={this.state.error} />}

        <div className="payment-section-title-container">
          <h2 className="payment-section-title">Credit & Debit Cards</h2>
          <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards.subSections.addCreditCard}
            className="payment-add-new-button">Add New</HyperLink>
        </div>

        <ul className="credit-card-items">
          {items.map((item) => { // render each address item
            return (<CreditCardItem key={item.onFileCardId} creditCardEntry={item}
              onDeleteItem={this.handleDeleteItem} onSetAsDefault={this.handleSetAsDefault} />
            );
          })}
        </ul>

        <ConfirmDeleteCreditCardModal isMobile={isMobile} deletingItem={deletingItem} />
      </div>
    );
  }

}

export {CreditCardsList};
