/** @module couponsPropTypes
 * @summary basic propTypes used for coupons
 *
 * @author Ben
 * FIXME: document each prop
 */
import {PropTypes} from 'prop-types';
import {
  SKU_INFO_PROP_TYPE_SHAPE,
  ITEM_INFO_PROP_TYPE_SHAPE,
  PRODUCT_INFO_PROP_TYPE_SHAPE,
  MISC_INFO_PROP_TYPES_SHAPE
} from './productsAndItemsPropTypes.js';

export const WISHLIST_ITEM_PROP_TYPE = PropTypes.shape({
  productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,
  skuInfo: SKU_INFO_PROP_TYPE_SHAPE.isRequired,
  itemInfo: ITEM_INFO_PROP_TYPE_SHAPE.isRequired,
  miscInfo: MISC_INFO_PROP_TYPES_SHAPE.isRequired,

  /** wishlist item which have been purchased by the user when at first was just added in the wishlist */
  quantityPurchased: PropTypes.number,

  /** prop for wish list shared */
  isReadOnly: PropTypes.bool
});

export const WISHLIST_PROP_TYPE = PropTypes.shape({
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  isDefault: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(WISHLIST_ITEM_PROP_TYPE).isRequired
});

export const WISHLIST_SUMMARIES_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  isDefault: PropTypes.bool.isRequired,
  itemsCount: PropTypes.number.isRequired
}));
