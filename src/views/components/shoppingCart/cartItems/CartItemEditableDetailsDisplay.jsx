/** @module CartItemEditableDetailsDisplay
 *
 * @summary A presentational comopnent rendering the editable details of a cart item: color, fit, size, and Quantity.
 *
 * This Component is not a form, and displays the data in a read-only manner. For a form that allows the user
 * to customize these item details use {@linkcode module: ./CartItemEditableDetailsForm}.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) {      // eslint-disable-line
  require('./_d.cart-item-editable-details-display.scss');
} else {
  require('./_m.cart-item-editable-details-display.scss');
}

export class CartItemEditableDetailsDisplay extends React.Component {

  static propTypes = {
    // /** Flags if to use condensed version for mini-bag use */
    // isCondense: PropTypes.bool.isRequired,

    /** The name of the item (e.g. 'Boys Five-Pocket Skinny Corduroy Pants') */
    productName: PropTypes.string.isRequired,

    /** optional displayNames of the color fit and size (e.g., for gift cards it is {color: 'Design', size: 'Value') */
    colorFitSizeDisplayNames: PropTypes.shape({ color: PropTypes.string, fit: PropTypes.string, size: PropTypes.string }),

    /** The color/pattern */
    color: PropTypes.shape({ // not required for gift cards
      /** The color's name (e.g. 'Clay') */
      name: PropTypes.string.isRequired,
      /** The url to an image displaying this color/pattern */
      imagePath: PropTypes.string
    }),

    /** The fit (e.g. 'slim') */
    fit: PropTypes.string, // not required for gift cards

    /** The size (e.g. '5S') */
    size: PropTypes.string, // not required for gift cards

    /** The quantity of this item in the cart */
    quantity: PropTypes.number.isRequired,

    /** a callback to change the item status from read-only to editable */
    setItemEditable: PropTypes.func.isRequired,

    /** flags if the user is allowed to try and edit this item */
    isEditAllowed: PropTypes.bool.isRequired,

    /** Flags if to use condensed version for mini-bag use */
    isCondense: PropTypes.bool
  }

  render () {
    let {productName, color, fit, size, quantity, setItemEditable, isEditAllowed, isCondense, colorFitSizeDisplayNames} = this.props;

    let colorImage = color && color.imagePath && <img src={color.imagePath}></img>;
    colorFitSizeDisplayNames = {color: 'Color', fit: 'Fit', size: 'Size', ...colorFitSizeDisplayNames};
    return (
      <div className={'container-description-view' + (isEditAllowed ? '' : ' no-edit-item')}>
        <p className="container-description-item">
          {color && <span className="text-color">{colorFitSizeDisplayNames.color}: {color.name}{colorImage}</span>}
          {fit && <span className="text-size">{colorFitSizeDisplayNames.fit}: {fit}</span>}
          {size && <span className="text-size">{colorFitSizeDisplayNames.size}: {size}</span>}
          <span className="text-qty">{isCondense ? 'Qty:' : 'Quantity:'} {quantity}</span>
        </p>
        {isEditAllowed && <button type="button"
          className="button-edit-product"
          onClick={setItemEditable}
          title={'Edit Product: ' + productName}
          aria-label={'Edit Product: ' + productName}>Edit</button>
        }
      </div>
    );
  }

}
