/**
 * @module CheckoutCartItemsList
 * @author Florencia Acosta
 * @author Miguel Alvarez Igarzábal
 * Shows the list of cart items for Checkout Express and Checkout Review,
 * grouped by fulfillment centers (stores), if present.
 *
 * Style (className) Elements description/enumeration:
 *  .list-products: main container for list of products
 *
 * Uses:
 *  <CheckoutCartItem />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';
import {CheckoutCartItem} from './CheckoutCartItem.jsx';
import {Accordion} from 'views/components/accordion/Accordion.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-cart-item-list.scss');
} else {
  require('./_m.checkout-cart-item-list.scss');
}

export class CheckoutCartItemsList extends React.Component {
  static propTypes = {
    /** mobile version renders as accordion */
    isMobile: PropTypes.bool.isRequired,

    /** amount of items in the cart (not items.length) */
    itemsCount: PropTypes.number.isRequired,

    /** List of products to show.
     * MUST BE ORDERED BY FULLFILMENT CENTER, with undefined store first.
     */
    items: PropTypes.arrayOf(PropTypes.shape({
      /**
       * Information regarding the product that this cart item refers to.
       * Essentially, the cart item is just some quantity of the product
       */
      productInfo: PropTypes.shape({
        /** This identifies the product with a given color fit and size combination */
        skuId: PropTypes.string.isRequired,
        /** The name of the product to be displayed to the user */
        name: PropTypes.string.isRequired,
        /** the url of the image of the product */
        imagePath: PropTypes.string.isRequired,
        /** The color/pattern */
        color: PropTypes.shape({
          /** The color's name (e.g. 'Clay') */
          name: PropTypes.string.isRequired
        }),
        /** The fit (e.g. 'slim') */
        fit: PropTypes.string,
        /** The size (e.g. '5S') */
        size: PropTypes.string.isRequired
      }).isRequired,

      /** Information about this cart item that is not a function of the product */
      itemInfo: PropTypes.shape({
        /** This cart item is made up of quantity many copies of the product */
        quantity: PropTypes.number.isRequired,
        /** the list price of this item (i.e., before any discounts) */
        listPrice: PropTypes.number.isRequired,
        /** the actuall price the user has to pay for this item */
        offerPrice: PropTypes.number.isRequired
      }).isRequired,

      miscInfo: PropTypes.shape({
        /**
         * If falsy (i.e., null, undefined, etc.) this item is to be shipped;
         * otherwise, it is the name of the store from which it is to be picked up
         */
        store: PropTypes.string,
        storeAddress: PropTypes.object
      }).isRequired
    })).isRequired,

    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired
  }

  render () {
    let {isMobile, itemsCount} = this.props;

    return isMobile ? <Accordion title={'My Bag (' + itemsCount + ')'} className="accordion-cart-list">
      {this.renderItems()}
    </Accordion>
    : this.renderItems();
  }

  renderItems () {
    let {items, itemsCount, currencySymbol} = this.props;

    let isPickupOrder = items.findIndex((item) => item.miscInfo.store) >= 0;

    let currentStore = (isPickupOrder && items.length && items[0].miscInfo) ? !items[0].miscInfo.store : undefined;
    let renderedStores = [];
    let currentStoreAddress;
    let currentStoreItems = [];
    items.forEach(function (item) {
      // When there is at least one pick-up and we are at the first product or
      // the store has changed, start a new list of products for the store
      if (item.miscInfo.store !== currentStore) {
        currentStoreItems = [];
        currentStore = item.miscInfo.store;
        currentStoreAddress = item.miscInfo.storeAddress;
        renderedStores.push({
          store: currentStore,
          storeAddress: currentStoreAddress,
          storePhoneNumber: item.miscInfo.storePhoneNumber,
          storeTodayOpenRange: item.miscInfo.storeTodayOpenRange,
          storeTomorrowOpenRange: item.miscInfo.storeTomorrowOpenRange,
          list: currentStoreItems
        });
      }
      currentStoreItems.push(
        <CheckoutCartItem key={item.itemInfo.itemId} {...item} currencySymbol={currencySymbol} />
      );
    });

    return (
      <div className="checkout-cart-list">
        <h3>My Bag ({itemsCount})</h3>
        {renderedStores.map((storeItemsList) => [
          isPickupOrder && <div key="0" className="header-list">
            {!storeItemsList.store
            ? <span className="title-list-product">Shipping</span>
            : <div className="title-list-pickup-product">
              <span className="title-list-product">Pickup</span>
              <span className="store-of-product">{storeItemsList.store}</span>
              <ButtonTooltip className="tooltip-information-store" type="info" title={storeItemsList.store}>
              {storeItemsList.storeAddress &&
                <p>
                  {storeItemsList.storeAddress.addressLine1}<br />
                  {storeItemsList.storeAddress.addressLine2 && <span>{storeItemsList.storeAddress.addressLine2}<br /></span>}
                  {storeItemsList.storeAddress.city +
                    ', ' + storeItemsList.storeAddress.state +
                    ' ' + storeItemsList.storeAddress.zipCode}<br /><br />
                  <em>Today:</em> {storeItemsList.storeTodayOpenRange}<br />
                  <em>Tomorrow:</em> {storeItemsList.storeTomorrowOpenRange}<br />
                  <em>Phone:</em> {storeItemsList.storePhoneNumber}
                </p>
              }
              </ButtonTooltip>
            </div>}
          </div>,

          <ul key="1" className="container-list-shopping-cart">
            {storeItemsList.list}
          </ul>
        ])}
      </div>
    );
  }
}
