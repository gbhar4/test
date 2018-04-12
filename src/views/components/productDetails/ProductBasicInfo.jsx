/** @module ProductBasicInfo
 * @summary Show the product's name, rating and wishlist CTA.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductRating} from './ProductRating.jsx';
import {FavoriteButtonContainer} from './FavoriteButtonContainer.js';
import {ProductPrice} from './ProductPrice.jsx';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {getMapSliceForColor, getPrices, getSkuId} from 'util/viewUtil/productsCommonUtils.js';
import {BadgeItem} from 'views/components/product/ProductItemComponents.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-details-header.scss');
} else {
  require('./_m.product-details-header.scss');
}

export class ProductBasicInfo extends React.Component {
  static propTypes = {
    /**
     *  Describes a general product, not yet specialized by chosing a color, size, etc.
     *  For example, a product shown in reccomendations, or PDP.
     */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /** the currently selected color for this product */
    color: PropTypes.string.isRequired,
    /** the currently selected quantity for this product */
    quantity: PropTypes.number.isRequired,

    /** the currently selected fit (if any) for this product */
    fit: PropTypes.string,
    /** the currently selected size (if any) for this product */
    size: PropTypes.string,

    /* The session currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    /** Flags if the price row should be visible */
    isPriceVisible: PropTypes.bool.isRequired,
    /** Flags if the product rating should be visible */
    isRatingsVisible: PropTypes.bool.isRequired,

    /* Flag to get url of product detail, if it is needed (example: outfit) */
    pdpUrl: PropTypes.string,

    /* Badge's text. If it cames, product title will render with badge item above */
    badge: PropTypes.string,

    /** Indicates whether to show the favorites count or not (outfit won't show it) */
    isShowFavoriteCount: PropTypes.bool
  }

  productName (name, pdpUrl) {
    let title = <h1 className="product-title" itemProp="name">{name}</h1>;
    return (typeof pdpUrl === 'string'
      ? <a href={pdpUrl} className="product-link-title">{title}</a>
      : title
    );
  }

  render () {
    let {
      pdpUrl,
      badge,
      isShowFavoriteCount,
      productInfo: {generalProductId, isInDefaultWishlist, colorFitsSizesMap, name, ratingsProductId, isGiftCard},
      productInfo, isPriceVisible, isRatingsVisible, color, fit, size, quantity, currencySymbol
    } = this.props;

    let colorSlice = getMapSliceForColor(colorFitsSizesMap, color);
    let prices = getPrices(productInfo, color, fit, size);
    let skuId = getSkuId(colorFitsSizesMap, color, fit, size);

    return (
      <div className="product-details-header-container">
        <div className="information-container">
          {this.productName(name, pdpUrl)}
          <BadgeItem className="inline-badge-item" text={badge} />
          {!isGiftCard && ratingsProductId && isRatingsVisible && <ProductRating ratingsProductId={ratingsProductId} />}
        </div>

        {!isGiftCard && (
          <FavoriteButtonContainer isActiveHoverMessage favoritedCount={colorSlice.favoritedCount}
            generalProductId={generalProductId} colorProductId={colorSlice.colorProductId} skuId={skuId} quantity={quantity}
            isInDefaultWishlist={isInDefaultWishlist} isShowFavoriteCount={isShowFavoriteCount} />
        )}

        {isPriceVisible && (
          <ProductPrice currencySymbol={currencySymbol} isItemPartNumberVisible={!isGiftCard}
            itemPartNumber={colorSlice.colorDisplayId} {...prices} />
        )}
      </div>
    );
  }
}
