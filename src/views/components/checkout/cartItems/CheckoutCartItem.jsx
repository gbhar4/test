/**
 * @module CheckoutCartItem
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows one cart item for the list of cart items in check-out.
 *
 * Style (ClassName) Elements description/enumeration
 *  .item-shopping-cart
 *
 * Uses
 *  -
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class CheckoutCartItem extends React.Component {
  static propTypes = {
    /**
     * Information regarding the product that this cart item refers to.
     * Essentially, the cart item is just some quantity of the product
     */
    productInfo: PropTypes.shape({
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
      store: PropTypes.string
    }).isRequired,

    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired
  }

  render () {
    let {
      productInfo: {name, imagePath, color, fit, size},
      itemInfo: {quantity, listPrice, offerPrice},
      currencySymbol
    } = this.props;

    return (
      <li className="item-shopping-cart">
        <div className="container-image">
          <img src={imagePath} alt={'Image for product ' + name} />
        </div>
        <figcaption className="product-description">
          <h4 className="department-name">{name}</h4>

          <div className="container-description-view">
            {color && <span className="text-color">Color: {color.name}</span>}
            {fit && <span className="text-size">Fit: {fit}</span>}
            {size && <span className="text-size">Size: {size}</span>}
            <span className="text-qty">Qty {quantity}</span>
          </div>

          <div className="container-price">
            {/* FIXME: number format to be controlled globally */}
            {(listPrice !== offerPrice) && <span className="text-price product-list-price">{currencySymbol + (listPrice).toFixed(2)}</span>}
            <span className="text-price product-offer-price">{currencySymbol + (offerPrice).toFixed(2)}</span>
          </div>
        </figcaption>
      </li>
    );
  }
}
