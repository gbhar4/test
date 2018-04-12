/** @module PDP - Product Price
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-price.scss');
} else {
  require('./_m.product-price.scss');
}

class ProductPrice extends React.Component {
  propTypes: {
    /** Whether to render for mobile. */
    isItemPartNumberVisible: PropTypes.bool.isRequired,

    /* The session currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    /** List price */
    listPrice: PropTypes.number.isRequired,

    /** Offer price */
    offerPrice: PropTypes.number,

    /** Product Item Part number */
    itemPartNumber: PropTypes.string
  }

  render () {
    let {isItemPartNumberVisible, itemPartNumber, currencySymbol, listPrice, offerPrice} = this.props;

    return (
      <section className="product-price-container" itemScope itemType="https://schema.org/Offer">
        {(offerPrice && offerPrice !== listPrice)
          ? [<span key="current-price" className="price-item actual-price" itemProp="price">{currencySymbol}{offerPrice.toFixed(2)}</span>,
            <span key="original-price" className="price-item original-price">Was {currencySymbol}{listPrice.toFixed(2)}</span>]
          : <span className="price-item actual-price" itemProp="price">{currencySymbol}{listPrice.toFixed(2)}</span>}

          {isItemPartNumberVisible && <strong className="number-item">Item #: {itemPartNumber}</strong>}

        <meta itemProp="priceCurrency" content="{currencySymbol}"/>
        <link itemProp="availability" href="http://schema.org/InStock" />
      </section>
    );
  }
}

export {ProductPrice};
