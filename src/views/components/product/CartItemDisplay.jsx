/**
 * @module CartItemDisplay
 * Shows information for a product in the cart, including the product thumbnail,
 * selected color, size, fit, quantity and, optionally, price.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {
  SKU_INFO_PROP_TYPE_SHAPE,
  PRICING_PROP_TYPES
} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';

/* TODO: this component should be re-used from CheckoutCartItem */
export class CartItemDisplay extends React.Component {
  static propTypes = {
    cartItem: PropTypes.shape({
      /** indicates the product is a gift card (for copy) */
      isGiftCard: PropTypes.bool.isRequired,

      /** The name of the product to be displayed to the user */
      productName: PropTypes.string.isRequired,

      /**
       * Extra information (to add to product_info)  that describes a specific
       * SKU (Stock Keeping Unit)
       */
      skuInfo: SKU_INFO_PROP_TYPE_SHAPE.isRequired,

      /** This cart item is made up of quantity many copies of the product */
      quantity: PropTypes.number.isRequired,

      pricingInfo: PropTypes.shape({
        ...PRICING_PROP_TYPES
      })
    }),

    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    isPriceVisible: PropTypes.bool.isRequired
  }

  render () {
    let {
      cartItem: {
        isGiftCard,
        productName,
        skuInfo: {imageUrl, color, fit, size},
        quantity, pricingInfo
      },
      isPriceVisible, currencySymbol
    } = this.props;

    return (
      <div className="cart-item-display">
        <div className="container-image">
          <img src={imageUrl} alt={'Image for product ' + productName} />
        </div>
        <figcaption className="product-description">
          <h4 className="department-name">{productName}</h4>

          <div className="container-description-view">
            {color && <span className="text-color">{!isGiftCard ? 'Color' : 'Design'}: {color.name}</span>}
            {!isGiftCard && (fit && fit !== 'null') && <span className="text-size">Fit: {fit}</span>}
            {size && <span className="text-size">{!isGiftCard ? 'Size' : 'Value'}: {size}</span>}
            <span className="text-qty">Qty {quantity}</span>
          </div>

          {isPriceVisible && (
            <div className="container-price">
              {/* FIXME: number format to be controlled globally */}
              {(pricingInfo.listPrice !== pricingInfo.offerPrice) && <span className="text-price product-list-price">{currencySymbol + (pricingInfo.listPrice).toFixed(2)}</span>}
              <span className="text-price product-offer-price">{currencySymbol + (pricingInfo.offerPrice).toFixed(2)}</span>
            </div>
          )}
        </figcaption>
      </div>
    );
  }
}
