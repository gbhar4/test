/** @module BopisHeader
 *
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';

export class BopisHeader extends React.Component {
  static propTypes = {
    /* the list of stores currently in the cart */
    cartBopisStoresList: PropTypes.arrayOf(PropTypes.shape({
      basicInfo: PropTypes.shape({
        storeName: PropTypes.string.isRequired
      }).isRequired
    })).isRequired, // REVIEW: is it require? cart might be empty

    /* the maximum number of different stores used for BOPIS in a single shopping cart */
    maxAllowedStoresInCart: PropTypes.number.isRequired
  }

  belowLimitMessage () {
    let descMessage1 = 'Enter your zip code and/or state to find your selected item(s) in a store near you.';
    let descMessage2 = `(limit of ${this.props.maxAllowedStoresInCart} pickup locations per order)`;
    return (<div className="available-product-header-container">
        <h3 className="title-container">In-Store Availability</h3>
        <p className="message-container">{descMessage1}<br />{descMessage2}</p>
      </div>);
  }

  limitReachedMessage () {
    let {cartBopisStoresList} = this.props;
    let descMessage = 'You can choose from your two previously selected stores: ' + cartBopisStoresList[0].basicInfo.storeName;
    for (let i = 1; i < cartBopisStoresList.length; i++) {
      descMessage += ' and ' + cartBopisStoresList[i].basicInfo.storeName;
    }

    return (<div className="available-product-header-container">
        <h3 className="title-container">{`You are limited to ${this.props.maxAllowedStoresInCart} locations for In-Store Pickup`}</h3>
        <p className="message-container">{descMessage}.</p>
      </div>);
  }

  render () {
    let {cartBopisStoresList, maxAllowedStoresInCart} = this.props;

    return (cartBopisStoresList.length < maxAllowedStoresInCart)
      ? this.belowLimitMessage()
      : this.limitReachedMessage();
  }
}
