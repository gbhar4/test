/** @module CartItem
 * @summary a presentational component that renders a single ghost representation of product that was removed from the shopping cart.
 *
 * @Author Florencia Acosta
 * @Author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) {      // eslint-disable-line
  require('./_d.cart-items.scss');
} else {
  require('./_m.cart-items.scss');
}

const GHOST_REASON_DELETED = 'DELETED';
const GHOST_REASON_WISHLIST = 'WISHLIST';

export class CartGhostItem extends React.Component {
  static propTypes = {
    /** The name of the product to be displayed to the user */
    productName: PropTypes.string.isRequired,

    /** indicates why this item is a ghost */
    ghostReason: PropTypes.oneOf([GHOST_REASON_DELETED, GHOST_REASON_WISHLIST])
  }

  render () {
    let {productName, ghostReason} = this.props;

    let messageSuffix = ghostReason === GHOST_REASON_DELETED
      ? ' has been removed from your bag.'
      : ' has been moved to wishlist.';

    return (
      <div className="item-product container-product-deleted">
        <h3><i>{productName}</i>{messageSuffix}</h3>
        <button className="button-undo-removed">Undo</button>
      </div>
    );
  }
}
