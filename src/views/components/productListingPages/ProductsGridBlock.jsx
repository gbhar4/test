/** @module ProductsGridBlock
 * @summary a pure component that renders a block (aka page) of products in a PLP.
 *
 *  Note: the reason we break the products listing page into blocks is to have more efficient rendering: when
 *  we load or modify a block. All other existing blocks do not re-render.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductsGridItem} from './ProductsGridItem.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.products-grid.scss');
} else {
  require('./_m.products-grid.scss');
}

export class ProductsGridBlock extends React.PureComponent {
  static propTypes = {
    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,

    /** the products to render */
    productsAndTitles: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        ProductsGridItem.propTypes.item
      ])
    ).isRequired,

    /** Price related currency symbol to be rendered */
    currencySymbol: ProductsGridItem.propTypes.currencySymbol,

    /** the generalProductId of the product (if any) requesting quickView to show */
    showQuickViewForProductId: PropTypes.string,
    /** callback for clicks on quickView CTAs. Accepts a generalProductId, colorProductId */
    onQuickViewOpenClick: PropTypes.func.isRequired,
    /** callback for clicks on BOPIS CTAs. Accepts: generalProductId, initialValues, colorProductId. Required if isBopisEnabled prop is true. */
    onQuickBopisOpenClick: PropTypes.func,
    /** When flase, flags that BOPIS is globaly disabled */
    isBopisEnabled: PropTypes.bool,

    /** callback for clicks on wishlist CTAs. Accepts: colorProductId. */
    onAddItemToFavorites: PropTypes.func,
    /** callback to trigger when the user chooses to display a different color (used to retrieve prices) */
    onColorChange: PropTypes.func.isRequired
  };

  render () {
    let {productsAndTitles, isMobile, isBopisEnabled, currencySymbol,
      onQuickViewOpenClick, onQuickBopisOpenClick, onAddItemToFavorites, showQuickViewForProductId, onColorChange} = this.props;

    return (
      <div className="product-grid-block-container">
        {productsAndTitles.map((item) =>
          typeof item === 'string'
            ? <h2 key={item} className="item-title">{item}</h2>
            : <ProductsGridItem isMobile={isMobile} key={item.productInfo.generalProductId} item={item}
            isShowQuickView={showQuickViewForProductId === item.productInfo.generalProductId} currencySymbol={currencySymbol}
            onAddItemToFavorites={onAddItemToFavorites} onQuickViewOpenClick={onQuickViewOpenClick} onQuickBopisOpenClick={onQuickBopisOpenClick}
            onColorChange={onColorChange} isBopisEnabled={isBopisEnabled} />
        )}
      </div>
    );
  }
}
